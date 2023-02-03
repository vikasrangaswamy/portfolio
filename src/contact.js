
import {HeaderData,AboutData,ContactData,FooterData,GalleryData} from "../data/data.js"
class Contact{


    render(){

        //Creating elements
        const footer=document.createElement("div")
        const flexBox=document.createElement("div")
        const flexBoxText=document.createElement("div")
        const flexBoxTextP1 = document.createElement("h1")
        const flexBoxTextP2 = document.createElement("h1")
        const flexBoxButtons = document.createElement("div")
        const horizontalLine1= document.createElement("hr")
        const horizontalLine2= document.createElement("hr")
        const mailButton=document.createElement("button")
        const phoneButton=document.createElement("button")
        const GetInTouchButton=document.createElement("button")

        // Adding classes and Id's
        footer.classList.add("footer")
        footer.id="contact"
        flexBox.classList.add("flex-box")
        mailButton.id="mail"
        phoneButton.id="phone"
        GetInTouchButton.id="get-in-touch"
        
        flexBoxTextP1.innerHTML=ContactData.contactText1
        flexBoxTextP2.innerHTML=ContactData.contactText2
        
        //Adding data
        mailButton.innerHTML=ContactData.contactButtons[0].email
        phoneButton.innerHTML=ContactData.contactButtons[1].phone
        GetInTouchButton.innerHTML=ContactData.contactButtons[2].contactForm

        //Appending the containers
        footer.appendChild(flexBox)
        flexBox.appendChild(flexBoxText)
        flexBoxText.appendChild(flexBoxTextP1)
        flexBoxText.appendChild(flexBoxTextP2)
        flexBox.appendChild(flexBoxButtons)
        flexBoxButtons.appendChild(horizontalLine1)
        flexBoxButtons.appendChild(mailButton)
        flexBoxButtons.appendChild(phoneButton)
        flexBoxButtons.appendChild(GetInTouchButton)
        flexBoxButtons.appendChild(horizontalLine2)

        return footer

    }
    mount(element){
        if(element){
            element.appendChild(this.render())
            return
        }
        document.body.appendChild(this.render())
    }
}

export {Contact}