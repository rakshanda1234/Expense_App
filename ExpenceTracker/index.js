function addNewExpnse(e) {
  e.preventDefault();

  const expenseDetails = {
    expenseAmount: e.target.expenseamount.value,
    description: e.target.description.value,
    category: e.target.category.value,
  };

  console.log(expenseDetails);
}
