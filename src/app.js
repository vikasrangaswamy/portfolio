//Importing Classes
import { About } from "./about.js";
import { Header } from "./header.js";
import { Contact } from "./contact.js";
import { Footer } from "./footer.js";
// import { GALLERY } from "./gallery.js";

const app=()=>{

//getting root
const root=document.getElementById("root")

//Header
const newHeader= new Header()
const newAbout=new About()
const newContact=new Contact()
const newFooter=new Footer()


//Creating new instances of classes 
newHeader.mount(root)
newAbout.mount(root)
newContact.mount(root)
newFooter.mount(root)
}

app()
