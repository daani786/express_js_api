const getMenuHtml = () => {
  let menuHtml = "";
  menuHtml += "<ul>";
  menuHtml += "<li><a href='/'>Home</a></li>";
  menuHtml += "<li><a href='/about'>About Page</a></li>";
  menuHtml += "<li><a href='/about?name=Adnan'>About Page (Adnan)</a></li>";
  menuHtml += "<li><a href='/users'>Users</a></li>";
  menuHtml += "<li><a href='/api/users'>Api Users</a></li>";
  menuHtml += "</ul>";
  return menuHtml;
}

const getUserHtml = (user, useMongodb = false) => {
  let html = "";
  html += "<ul>";
  html += `<li>Id: ${user.id}</li>`;
  if (useMongodb) {
    html += `<li>Name: ${user.firstName} ${user.lastName}</li>`;
    html += `<li>Email: ${user.email}</li>`;
    html += `<li>Gender: ${user.gender}</li>`;
    html += `<li>Job Title: ${user.jobTitle}</li>`;
  } else {
    html += `<li>Name: ${user.first_name} ${user.last_name}</li>`;
    html += `<li>Email: ${user.email}</li>`;
    html += `<li>Gender: ${user.gender}</li>`;
    html += `<li>Job Title: ${user.job_title}</li>`;
  }
  html += `<li><a href='/users/${user.id}'>Link</a></li>`;
  html += `<li><a href='/api/users/${user.id}'>Json Link</a></li>`;
  html += "</ul>";
  return html;
}

module.exports = {
  getMenuHtml,
  getUserHtml
};