// Fake data
import Users from "./fake-data/users.json";
import Content from "./fake-data/content.json";
import Documentaries from "./fake-data/documentaries.json";
import Movies from "./fake-data/movies.json";
import Series from "./fake-data/series.json";
import SingleDocumentary from "./fake-data/singleDocumentary.json";
import SingleMovie from "./fake-data/singleMovie.json";
import SingleSerie from "./fake-data/singleSerie.json";

// Project files
import eContentType from "interfaces/eContentType";
import iContent from "interfaces/iContent";
import iDetailsOther from "interfaces/iDetailsOther";
import iDetailsSeries from "interfaces/iDetailsSeries";
import eUserType from "interfaces/eUserType";

export default function fakeServer(endPoint: string, data: any = null): any {
  switch (endPoint) {
    // Auth
    case "login/":
      return authLogin(data);
    case "register/":
      return authRegister(data);

    // Content
    case "content/":
      let fetcheddata :object = [];
        fetch("http://localhost:8082/content",{
          method:"GET",
          mode:"no-cors"
        })
        .then(res => res.json() )
        .then(d => {
          console.log(d);
          fetcheddata =  d } )
        .catch(function (ex) {
            console.log('Exception   ',ex);
        })  
      return fetcheddata;
      // return Content;
    case "content/create/":
      fetch("http://localhost:8082/postcontent",{
        method:"POST",
        mode:"no-cors",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data)  
      })
      .then(res => res.json() )
      .then(json => console.log('Data saved !!!') )
      .catch(function (ex) {
          console.log('Exception   ',ex);
      })
      return contentCreate(data);

    case "content/delete/":
      fetch(`http://localhost:8082/content/${data.id}`,{
        method:"DELETE",
        mode:"no-cors",
        headers: { 'Content-type': 'application/json' },
      })
      .then(res => res.json() )
      .then(json => console.log('deleted !!!') )
      .catch(function (ex) {
          console.log('Exception   ',ex);
      })
      return contentDelete(data);

    case "content/update/":
      fetch(`http://localhost:8082/content/${data.id}`,{
        method:"PUT",
        mode:"no-cors",
        headers: { 'Content-type': 'application/json' },
      })
      .then(res => res.json() )
      .then(d => console.log('updated'))
      .catch(function (ex) {
          console.log('Exception   ',ex);
      })  
      return contentUpdate(data);


    // Content filtered
    case "content/series/":
      let series:object=[];
      fetch("http://localhost:8082/content/series",{
        method:"GET",
        mode:"no-cors"
      })
      .then(res => res.json() )
      .then(d => {
        console.log(d);
        series =  d } )
      .catch(function (ex) {
          console.log('Exception   ',ex);
      })  
      return series;
      // return Series;
    case "content/movies/":
      let movies:object=[];
      fetch("http://localhost:8082/content/movies",{
        method:"GET",
        mode:"no-cors"
      })
      .then(res => res.json() )
      .then(d => {
        console.log(d);
        movies =  d } )
      .catch(function (ex) {
          console.log('Exception   ',ex);
      })  
      return movies;
      // return Movies;
    case "content/documentaries/":
      let documentaries:object=[];
      fetch("http://localhost:8082/content/documentaries",{
        method:"GET",
        mode:"no-cors"
      })
      .then(res => res.json() )
      .then(d => {
        console.log(d);
        documentaries =  d } )
      .catch(function (ex) {
          console.log('Exception   ',ex);
      })  
      return documentaries;
      // return Documentaries;

    // Details others
    case "details-other/:id/":
      return detailsOther(data);
    case "details-other/:id/update/":
      return detailsOtherUpdate(data);

    // Details series
    case "details-series/:id/":
      
      return detailsSeries(data);
    case "details-series/:id/create/":
      fetch("http://localhost:8082/postseries",{
        method:"POST",
        mode:"no-cors",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(data)  
      })
      .then(res => res.json() )
      .then(d => console.log("saved series") )
      .catch(function (ex) {
          console.log('Exception   ',ex);
      })  

      return detailsSeriesCreate(data);
    case "details-series/:id/update/":
      fetch(`http://localhost:8082/series/${data.id}`,{
        method:"PUT",
        mode:"no-cors"
      })
      .then(res => res.json() )
      .then(d => console.log("updated") )
      .catch(function (ex) {
          console.log('Exception   ',ex);
      })  

      return detailsSeriesUpdate(data);
    case "details-series/:id/delete/":
      fetch(`http://localhost:8082/series/${data.id}`,{
        method:"DELETE",
        mode:"no-cors"
      })
      .then(res => res.json() )
      .then(d => console.log("deleted") )
      .catch(function (ex) {
          console.log('Exception   ',ex);
      })  
      return detailsSeriesDelete(data);

    // Exception
    default:
      throw new Error(`invalid endpoint ${endPoint}`);
  }
}

// Auth
function authLogin(data: any) {
  const { email, password } = data;

  const admin = Users[0];
  const customer = Users[1];

  if (email === admin.email && password === admin.password) {
    return admin;
  }

  if (email === customer.email && password === customer.password) {
    return customer;
  }

  throw new Error("Invalid credentials");
}

/**
 * Notes to the students
 * Here you check that the email does not exist on the server.
 * If so, you return an error message telling this.
 *
 * Otherwise you create a customer user by adding the type = 2.
 *
 * Note: Admin users are created only inside the database, not from this website.
 */
function authRegister(data: any) {
  const { email } = data;

  const chanceToSucced = generateRandomNumber(5);

  // Existing email account
  if (chanceToSucced == 1) {
    return `The user ${email} already exist on our database. Do you want to login instead?`;
  }

  // Manage to create a new user
  data.type = eUserType.CUSTOMER; // to convert this user into a customer

  return data;
}

// Content
function contentCreate(item: iContent): string {
  return `Created new content ${item.title}`;
}

function contentUpdate(item: iContent): string {
  return `Updated content ${item.title}`;
}

function contentDelete(id: number): string {
  return `Deleted content with id ${id}`;
}

// Details other
function detailsOther(id: number): iDetailsOther {
  const content = Content.filter((item) => item.id === Number(id))[0];

  switch (content.type_id) {
    case eContentType.MOVIES:
      return SingleMovie;
    case eContentType.DOCUMENTARIES:
      return SingleDocumentary;
    default:
      throw new Error(`Invalid type id ${id}`);
  }
}

function detailsOtherUpdate(item: iDetailsOther): string {
  return `Update content details id ${item.id}`;
}

// Details series
function detailsSeries(id: number): iDetailsSeries[] {
  const content = Content.filter((item) => item.id === Number(id))[0];

  switch (content.type_id) {
    case eContentType.SERIES:
      return SingleSerie;
    default:
      throw new Error(`Invalid type id ${id}`);
  }
}

function detailsSeriesCreate(item: iDetailsSeries) {
  return `Created new episode ${item.title}`;
}

function detailsSeriesUpdate(item: iDetailsSeries) {
  return `Update episode ${item.title}`;
}

function detailsSeriesDelete(id: number) {
  return `Deleted episode with id ${id}`;
}

function generateRandomNumber(limit: number) {
  return Math.floor(Math.random() * limit);
}
