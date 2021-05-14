$(document).ready(function () {
    /* GESTIONE PIATTI */
    
    function getPiatti() {
        $.get('/piatti', function (resume) {
            const listaPiatti = $('#listaPiatti');
            for (let i = resume.length -1; i >= 0; i--) {
                $(`<tr id='riga-${resume[i].id}'>
                <td class='nome'>${resume[i].nome}</td>
                <td class='prezzo'>${resume[i].prezzo}</td>
                <td class='categoria'>${resume[i].categoria.nome}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button id="btnGroupDrop` + i + `" type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Opzioni</button>
                            <ul class="dropdown-menu" aria-labelledby="btnGroupDrop` + i + `">
                            <li><a class="dropdown-item btn-dettaglio" data-bs-toggle="modal" data-bs-target="#dettaglio" data-id='${resume[i].id}'>Dettaglio</a></li>
                                <li><a class="dropdown-item btn-modifica" data-bs-toggle="modal" data-bs-target="#modifica" data-id='${resume[i].id}'>Modifica</a></li>
                                <li><a class="dropdown-item btn-elimina" data-id='${resume[i].id}'>Elimina</a></li>
                            </ul>
                    </div>
                </td>
            </tr>`).hide().appendTo(listaPiatti).fadeIn(i * 20);
            }
          })
    }
    getPiatti();

    // Dettaglio Del Ristorante
    $('#listaPiatti').on('click', '.btn-dettaglio', function () {
        const idPiatto = $(this).attr('data-id');
        getPiatto(idPiatto);
    });
    function getPiatto(idPiatto) {
        $.get(`piatti/piattoid/${idPiatto}`, function (dettaglio) {
            console.log(dettaglio);
            const dettaglioPiatto = $('#dettaglioPiatto');
            $('#title').text(dettaglio.nome + ' Nel Dettaglio');
            $('#menuDettaglio').text("Menu di " + dettaglio.ragionesociale);
			let row = `
            <h4 class='fw-light text-dark'><strong class="fw-bolder">Nome: </strong>${dettaglio.nome}</h4> 
            <h4 class='fw-light text-dark'><strong>Prezzo: </strong>${dettaglio.prezzo}</h4>   
            <h4 class='fw-light text-dark'><strong>Categoria: </strong>${dettaglio.categoria.nome}</h4> 
            <h4 class='fw-light text-dark'><strong>Ingredienti: </strong>${dettaglio.ingredienti}</h4>
			`;
            $(row).hide().appendTo(dettaglioPiatto).fadeIn(500);
		})
        /* Bisogna OTTENERE
        $.get(`ristoranti/${idristorante}`, function(dettaglioRistorante) {
            const ristoranteListaPiatti = $('#listaMenuDettaglio');
            for (let i = listaPiatti.length -1; i >= 0; i--) {
                $(`<tr id='riga-${listaPiatti[i].id}'>
                <td>${listaPiatti[i].nome}</td>
                <td>${listaPiatti[i].prezzo}</td>
                <td>${listaPiatti[i].categoria.nome}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button id="btnGroupDrop1" type="button" class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Opzioni</button>
                            <ul class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                <li><a class="dropdown-item btn-dettaglio" data-bs-toggle="modal" data-bs-target="#dettaglio" data-id='${listaPiatti[i].id}'>Dettaglio</a></li>
                                <li><a class="dropdown-item btn-modifica-risto" data-bs-toggle="modal" data-bs-target="#modifica" data-id='${listaPiatti[i].id}'>Modifica</a></li>
                                <li><a class="dropdown-item btn-elimina-risto" data-id='${listaPiatti[i].id}'>Elimina</a></li>
                            </ul>
                    </div>
                </td>
            </tr>`).hide().appendTo(ristoranteListaPiatti).fadeIn(i * 150); //Gestisci i pulsanti
            }
        }) */
	} 

    function detetePiatto(id) {
        let idPagina = $(`#riga-${id}`);
        $.ajax({
            type: "DELETE",
            url: `piatti/elimina/${id}`,
            success: function (response) {
                idPagina.slideUp(300, function () {
                    idPagina.remove(); 
                })
            },
            error: function(error) {
                alert("Errore durante la cancellazione. Riprovare."); 
            }
        });
      }
      $('#listaPiatti').on('click', '.btn-elimina', function() {
        const id = $(this).attr('data-id');
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-primary mx-2'
            },
            buttonsStyling: false
          })
          swalWithBootstrapButtons.fire({
            title: 'Sei Sicuro?',
            text: "Operazione Irreversibile!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Elimina',
            cancelButtonText: 'Esci',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              swalWithBootstrapButtons.fire(
                'Cancellato!',
                'Il tuo Piatto è stato Eliminato.',
                'success'
              )
              detetePiatto(id);
            } else if (
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                'Uscita',
                'Il tuo Piatto è salvo',
                'error'
              )
            }
          })
      });
    
    function addpiatto(piatto){
        console.log(piatto);
        $.ajax({
            type: 'POST',
            url: '/piatti',
            data: JSON.stringify(piatto),
            contentType: 'application/json',
            dataType: 'json',
            success: function(response){
                if (response.messaggio === "Nessun piatto aggiunto"){
                    //  let formData = new FormData(); 
                    //  formData.append("file", fileupload.files[0]);
                    Swal.fire({
                        icon: 'error',
                        title: 'ATTENZIONE!',
                        text: 'Riprova'
                    })
                } else if (response.messaggio === "Aggiunta effettuata con successo!") {
                    Swal.fire({
                        icon: 'success',
                        title: 'INSERITO!',
                        text: 'Aggiunta andata a buon fine',
                        showConfirmButton: false,
                        timer: 1500
                    })
                      setTimeout(function () {
                          window.location.href='ristoranti.html';
                        }, 1500);
                    }
                }
            })
        }
       // Barra di Ricerca
    $ ("#ricercaPiatti").on("keyup",function(){
        var value = $(this).val().toLowerCase();
        $("#listaPiatti tr").filter (function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1 )
        } );
    });
});