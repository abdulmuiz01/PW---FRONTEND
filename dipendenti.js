function filter(categoria) {
  fetch("Dipendenti.json")
    .then((response) => response.json())
    .then((data) => {
      let filteredData;
      if (categoria === "all") {
        filteredData = data;
      } else if (categoria === "leggende") {
        // Filter employees hired before January 1, 2001
        filteredData = data.filter((employee) => {
          const parts = employee.dataAssunzione.split("/");
          // Parsing date in DD/MM/YYYY format
          const dataAssunzione = new Date(
            `${parts[2]}-${parts[1]}-${parts[0]}`
          );
          const dataLeggenda = new Date("2001-01-01");
          return dataAssunzione < dataLeggenda;
        });
      } else {
        filteredData = data.filter(
          (employee) => employee.categoria === categoria
        );
      }
      displayData(filteredData);
    })
    .catch((error) => console.error("Error fetching employee data:", error));
}

function caricaDati() {
  // Get the value of the 'dipendenti' parameter from the URL
  var parameter = getQueryStringValue("dipendenti");
  console.log(parameter);
  filter(parameter);
}

function displayData(data) {
  const tableBody = document.querySelector("#table tbody");
  tableBody.innerHTML = "";

  data.forEach((employee) => {
    if (employee.categoria === "dirigente") {
      const row = `
                <tr>
                    <td>${employee.categoria}</td>
                    <td>${employee.codiceFiscale}</td>
                    <td>${employee.nome}</td>
                    <td>${employee.cognome}</td>
                    <td>${employee.dataAssunzione}</td>
                    <td>null</td>
                </tr>`;
      tableBody.innerHTML += row;
    } else {
      fetch("Dipendenti.json")
        .then((response) => response.json())
        .then((jsonData) => {
          const x = jsonData.find(
            (d) => employee.nomeRiferimento === d.codiceFiscale
          );
          const referenceName = x ? `${x.nome} ${x.cognome}` : "N/A";
          const row = `
                        <tr>
                            <td>${employee.categoria}</td>
                            <td>${employee.codiceFiscale}</td>
                            <td>${employee.nome}</td>
                            <td>${employee.cognome}</td>
                            <td>${employee.dataAssunzione}</td>
                            <td>${referenceName}</td>
                        </tr>`;
          tableBody.innerHTML += row;
        });
    }
  });
}

function getQueryStringValue(parameter) {
  // Ottieni l'intera stringa di query dall'URL
  var queryString = window.location.search.substring(1);

  // Suddividi la stringa di query in coppie nome=valore
  var queryParams = queryString.split("?");

  // Cerca il parametro desiderato tra le coppie
  for (var i = 0; i < queryParams.length; i++) {
    var pair = queryParams[i].split("=");

    // Se trovi il parametro, restituisci il valore
    if (pair[0] === parameter) {
      return decodeURIComponent(pair[1]);
    }
  }

  // Se il parametro non è presente, restituisci null o un valore predefinito a tua scelta
  return null;
}
