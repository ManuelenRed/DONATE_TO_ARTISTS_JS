// Importa las funciones y clases necesarias de NEAR SDK
import { NearBindgen, near, call, view, initialize, Vector } from 'near-sdk-js'

// Importa la clase Donation y la constante STORAGE_COST desde el archivo model.ts
import { Donation, STORAGE_COST, Project, ProyectFunding } from './model'

// Importa la función assert desde utils.ts
import { assert } from './utils'

// Anotación para indicar que esta clase se vinculará con NEAR
@NearBindgen({})
class DonateToArtistContract {
  // Vector para almacenar las donaciones, la clase esta en el archivo model.ts
  donations: Vector<Donation> = new Vector<Donation>("v-uid");

  // Función que permite a un usuario hacer una donación
  @call({ payableFunction: true })
  donate({ beneficiary }: { beneficiary: string }) {    // Obtiene la cuenta que llama al método y los NEAR transferidos
    let donor  = near.predecessorAccountId();
    let donationAmount: bigint = near.attachedDeposit() as bigint;

    // Almacena el monto que se va a donar descontando el costo de almacenamiento si aplica
    let toTransfer = donationAmount;
    
    // Registra en el log la cuenta del beneficiario
    near.log(`Cuenta del beneficiario: ${beneficiary}`)

    // Llama a la funcion que busca en el vector si el donante ya le ha donado al artista antes y almacena el indice en el vector
    let donationIndex = this.findDonationIndex(donor , beneficiary);

    // Si el donante ya ha donado obtiene un indice positivo, actualiza la donación existente con el monto que transfirio en el vector
    if (donationIndex >= 0) {
      const existingDonation = this.donations.get(donationIndex);
      existingDonation.total_amount += donationAmount;
      this.donations.replace(donationIndex, existingDonation);

    } else {
      // Si es una nueva donación, verifica que el monto sea mayor al costo de almacenamiento y envia los datos a la función en utils.ts
      assert(donationAmount > STORAGE_COST, `El envío es de ${STORAGE_COST} yoctoNEAR`);
      
      // Resta el costo de almacenamiento al monto a transferir
      toTransfer -= STORAGE_COST

      // Crea una nueva donación y la agrega al vector
      let newDonation = new Donation(donor, beneficiary, toTransfer);
      this.donations.push(newDonation);
    }

    // Registra en el log un mensaje de agradecimiento, uso para validar los datos
    near.log(`Gracias ${donor } por donar ${donationAmount}! Tu donacion total es de ${toTransfer} para ${beneficiary}`)

    // Crea un batch de promesas para transferir los fondos al beneficiario, lo que indica que si alguna función no se ejecuta ninguna lo hará
    const promise = near.promiseBatchCreate(beneficiary);
    near.promiseBatchActionTransfer(promise, toTransfer);
  }

  // Encuentra el índice de la donación en el vector, recorriendo de acuerdo al tamaño del vector de donaciones
  findDonationIndex(donor: string, beneficiary: string): number {
    // Se transforma el vector en un array para recorrerlo
    const donationsArray = this.donations.toArray();
    for (let i = 0; i < donationsArray.length; i++) {
      let donation = donationsArray[i];
      if (donation.account_id_donor == donor && donation.account_id_beneficiary == beneficiary) {
        return i;
      }
    }
    return -1;
  }

  // Ver las primeras diez donaciones
  @view({})
  get_donations({ from_index = 0, limit = 10 }: { from_index: number, limit: number }): Donation[] {
    return this.donations.toArray().slice(from_index, from_index + limit);
  }

  @view({})
  get_donation({ account_id} : {account_id: string}): bigint {
    let total_donated: bigint = BigInt(0);
    // Se transforma el vector en un array para recorrerlo
    const donationsArray = this.donations.toArray();
    for (let i = 0; i < donationsArray.length; i++) {
      let donation = donationsArray[i];
      if (donation.account_id_beneficiary == account_id) {
        total_donated += donation.total_amount;
      }
    }
    return total_donated;
    
  }

}

// Anotación para indicar que esta clase se vinculará con NEAR
@NearBindgen({})
class ManagmentProject {
  // Vector que almacena los proyectos creados
  proyects: Vector<Project> = new Vector<Project>("v-uid");
  projectFundings: Vector<ProyectFunding> = new Vector<ProyectFunding>("v-uid");

  @call({})
  createProyect({project_name, description} : {project_name: string, description: string}): void{
    // Se asigna como dueño a la wallet que llama la función
    let owner  = near.predecessorAccountId();
    // Crea un nuevo proyecto
    let newProject = new Project(project_name, owner, description);
    // Se agrega al vector de proyectos
    this.proyects.push(newProject);
    // Obtiene el índice del proyecto recién creado
    const projectIndex = this.proyects.length - 1;
    // Log para validar que se haya creado el proyecto y su índice
    near.log(`Se ha creado el proyecto ${project_name} que consiste en ${description}. El dueño es ${owner}. Índice del proyecto: ${projectIndex}`);
    }

  @call({ payableFunction: true })
  donateToProject({ project_index }: { project_index: number }): void {
      // Obtiene el proyecto en el índice dado
      const projects = this.proyects.toArray();
      const project = projects[project_index]

      near.log(`Se quiere donar al proyecto: ${project.name}`);
      // Verificar si el índice del proyecto está dentro del rango válido
      assert(project_index >= 0 && project_index < this.proyects.length, "Proyecto no encontrado");

      // Obtiene la cuenta del donante
      const donor = near.predecessorAccountId();

      // Obtiene el valor que se va a donar
      let donationAmount: bigint = near.attachedDeposit() as bigint;
      // Se crea una variable de apoyo para descontar el valor de almacenamiento 
      let toTransfer = donationAmount;
      // Se valida si el valor a donar es mayor al de almacenamiento
      assert(donationAmount > STORAGE_COST, `El envío es de ${STORAGE_COST} yoctoNEAR`);
      // Resta el costo de almacenamiento al monto a transferir
      toTransfer -= STORAGE_COST
      // Crea una nueva instancia de ProjectFunding y se envian los valores 
      const projectFunding = new ProyectFunding(donor, project, toTransfer);

      // Crea un batch de promesas para transferir los fondos al dueño del proyecto, lo que indica que si alguna función no se ejecuta ninguna lo hará
      const promise = near.promiseBatchCreate(project.account_id_owner);
      near.promiseBatchActionTransfer(promise, toTransfer);

      // Actualiza el monto total donado al proyecto
      //project.total_amount += toTransfer;

      // Registra el proyecto de financiamiento
      this.projectFundings.push(projectFunding);

      // Log para validar que se haya realizado la donación
      near.log(`Se ha realizado una donación de ${toTransfer} NEAR al proyecto ${project.name} por ${donor}`);
    }
   
  // Ver todos los proyectos
  @view({})
  getAllProjects(): Project[] {
      return this.proyects.toArray();
  }

  //  Ver el listado de proyectos de acuerdo al dueño
  @view({})
  getProjectsByOwner({ owner_id }: { owner_id: string }): Project[] {
      const allProjects = this.proyects.toArray();
      const ownerProjects : Project[] = [];
      near.log(`Proyectos ${allProjects}`)
      // Filtrar los proyectos propiedad del dueño dado
      for (let i = 0; i < this.proyects.length; i++) {
          let project = allProjects[i];
          if (project.account_id_owner == owner_id) {
              ownerProjects.push(project);
          }
      }

      return ownerProjects;
    }
    

  // Ver el total donado aa todos los proyectos de un artista
  // @view({})
  // getTotalDonatedToOwner({ owner_id }: { owner_id: string }): bigint {
  //     let totalDonatedToOwner: bigint;

  //     // Iterar a través de todos los proyectos
  //     for (let i = 0; i < this.projectFundings.length; i++) {
  //         const funding = this.projectFundings[i];
  //         // Verificar si el dueño del proyecto coincide con el owner_id proporcionado
  //         if (funding.proyect.account_id_owner == owner_id) {
  //             totalDonatedToOwner += funding.total_amount;
  //         }
  //     }

  //     return totalDonatedToOwner;
  // }

  //   // Ver el total donado de acuerdo al nombre de un proyecto
  // @view({})
  // getTotalDonatedForProject({ project_name }: { project_name: string }): bigint {
  //     let totalDonated: bigint;

  //     // Sumar todas las donaciones para el proyecto dado
  //     for (let i = 0; i < this.projectFundings.length; i++) {
  //         const funding = this.projectFundings[i];
  //         if (funding.proyect.name == project_name) {
  //             totalDonated += funding.total_amount;
  //         }
  //     }

  //     return totalDonated;
  // }

}

