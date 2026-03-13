//premission

console.log('Po');

const tablePremission = document.querySelector(`[table-premissions]`);

if (tablePremission) {
  const buttonPremission = document.querySelector(`[button-submit]`);
  buttonPremission.addEventListener('click', () => {
    let permissions = [];
    const rows = tablePremission.querySelectorAll(`[data-name]`);

    rows.forEach(item => {
      const nameRole = item.getAttribute(`data-name`);
      const inputs = item.querySelectorAll(`input`);
      console.log(nameRole);


      if (nameRole == 'id') {
        inputs.forEach(input => {
          const id = input.value;
          permissions.push({
            id: id,
            permissions: []
          })
        })
      } else {
        inputs.forEach((input, index) => {
          if (input.checked) {
            permissions[index].permissions.push(nameRole);
          }
        });
      }

    });

    if (permissions.length > 0) {
      const url = `/admin/roles/permissions`;

      fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(permissions)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);

        })
    }


  });
}

//end premission

//data premission
const divRecord = document.querySelector(`[data-records]`);

if (divRecord) {
  const dataPermission = JSON.parse(divRecord.getAttribute(`data-records`));

  const tablePremissions = document.querySelector('[table-premissions]');

  dataPermission.forEach((item, index) => {
    const premissions = item.permissions;

    premissions.forEach(premission => {

      const rows = tablePremissions.querySelector(`[data-name="${premission}"]`);


      const inputs = rows.querySelectorAll(`input`);
      inputs[index].checked = true;
    })

  })


}



//end data premission
