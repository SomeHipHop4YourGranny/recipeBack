function httpErrorCreater({
  status: status = 500,
  message: message = "",
  additionalData: additionalData = "",
  errors: errors = [{ status, message, additionalData }]
}) {
  errors.map((err, i) => {
    console.log(`\nerror ${i} - ${JSON.stringify(err)}\n`);
    return 0;
  });

  return errors;
}

function idChecker({ id: id = "" }) {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return true;
  }
  return false;
}

export { httpErrorCreater, idChecker };
