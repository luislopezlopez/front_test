import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-crear-asamblea',
  templateUrl: './crear-asamblea.page.html',
  styleUrls: ['./crear-asamblea.page.scss'],
})
export class CrearAsambleaPage {
  formDataToSend: FormData;

  constructor() {
    this.formDataToSend = new FormData();
  }

  onFileChange(event: any, fieldName: string) {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.formDataToSend.append(fieldName, files[i]);
      }
      console.log(`Archivos ${fieldName} agregados:`, files);
    }
  }
  
  
  
  



  // async submitForm(event: any) {
  //   // Añadir los datos "hardcoded"
  //   const hardcodedData: any = {
  //     type: 'Ordinaria',
  //     convocationNumber: 1,
  //     title: 'Asamblea General Ordinaria 2024',
  //     date: '2024-08-13T15:00:00Z',
  //     timeStart: '15:00',
  //     timeEnd: '17:00',
  //     timeZone: 'America/Mexico_City',
  //     minimumQuorum: 50,
  //     attendees: [
  //       {
  //         name: 'Juan Pérez',
  //         email: 'juan.perez@example.com',
  //         type: 'Socio',
  //         shareholderData: {
  //           shareType: 'A',
  //           shareNumber: 100,
  //           capitalPercentage: 25,
  //           votingRight: true,
  //         },
  //       },
  //       {
  //         name: 'María Gómez',
  //         email: 'maria.gomez@example.com',
  //         type: 'Representante',
  //         representativeData: {
  //           representedName: 'Carlos Ruiz',
  //           documentPath: '', // Será reemplazado por el archivo
  //         },
  //       },
  //     ],
  //   };
  
  //   // Añadir los datos al FormData
  //   Object.keys(hardcodedData).forEach((key) => {
  //     if (Array.isArray(hardcodedData[key])) {
  //       hardcodedData[key].forEach((item: any, index: number) => {
  //         Object.keys(item).forEach((subKey) => {
  //           if (typeof item[subKey] === 'object' && !Array.isArray(item[subKey])) {
  //             Object.keys(item[subKey]).forEach((subSubKey) => {
  //               this.formDataToSend.append(
  //                 `${key}[${index}][${subKey}][${subSubKey}]`,
  //                 item[subKey][subSubKey]
  //               );
  //             });
  //           } else {
  //             this.formDataToSend.append(`${key}[${index}][${subKey}]`, item[subKey]);
  //           }
  //         });
  //       });
  //     } else {
  //       this.formDataToSend.append(key, hardcodedData[key]);
  //     }
  //   });
  
  //   // Imprimir todos los archivos antes de enviar
  //   this.formDataToSend.forEach((value, key) => {
  //     if (value instanceof File) {
  //       console.log(`File ${key}:`, value);
  //     } else {
  //       console.log(`${key}:`, value);
  //     }
  //   });
  
  //   // Enviar los datos al back-end
  //   axios.post('http://localhost:3000/assembly', this.formDataToSend, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   })
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error.response);
  //     });
  // }


  async submitForm(event: any) {
    // Crear el objeto con los datos de la asamblea
    const hardcodedData: any = {
      type: 'Ordinaria',
      convocationNumber: 1,
      title: 'Junta General Ordinaria para la Revisión Anual de Resultados y Toma de Decisiones de Socios',
      date: '2024-08-15T10:00:00Z',
      timeStart: '10:00',
      timeEnd: '13:00',
      timeZone: 'America/Mexico_City',
      minimumQuorum: 50, // Cumple con el 50% mínimo para la primera convocatoria
      attendees: [
        {
          name: 'Juan Pérez',
          email: 'juan.perez@example.com',
          type: 'Socio',
          shareholderData: {
            shareType: 'A',
            shareNumber: 100,
            capitalPercentage: 25,
            votingRight: true,
          },
        },
        {
          name: 'María Gómez',
          email: 'luisenrique.lopez01@gmail.com',
          type: 'Escrutador',
        },
        {
          name: 'Carlos Ruiz',
          email: 'enrique.lopez@mindsetmx.com',
          type: 'Presidente',
        },
      ],
    };
  
    // Añadir los datos al FormData
    Object.keys(hardcodedData).forEach((key) => {
      if (Array.isArray(hardcodedData[key])) {
        hardcodedData[key].forEach((item: any, index: number) => {
          Object.keys(item).forEach((subKey) => {
            if (typeof item[subKey] === 'object' && !Array.isArray(item[subKey])) {
              Object.keys(item[subKey]).forEach((subSubKey) => {
                this.formDataToSend.append(
                  `${key}[${index}][${subKey}][${subSubKey}]`,
                  item[subKey][subSubKey]
                );
              });
            } else {
              this.formDataToSend.append(`${key}[${index}][${subKey}]`, item[subKey]);
            }
          });
        });
      } else {
        this.formDataToSend.append(key, hardcodedData[key]);
      }
    });
  
    // Adjuntar los archivos
    const agendaFileInput: any = document.getElementById('agenda') as HTMLInputElement | null;
    const documentsFileInput: any = document.getElementById('documents') as HTMLInputElement | null;
  
    if (agendaFileInput && agendaFileInput.files.length > 0) {
      this.formDataToSend.append('agenda', agendaFileInput.files[0]);
    }
  
    if (documentsFileInput && documentsFileInput.files.length > 0) {
      for (let i = 0; i < documentsFileInput.files.length; i++) {
        this.formDataToSend.append('documents', documentsFileInput.files[i]);
      }
    }
  
    // Enviar los datos al back-end
    axios.post('http://localhost:3000/assembly', this.formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Error:', error.response);
    });
  }
  
  
  
}
