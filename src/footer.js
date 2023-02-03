import {HeaderData,AboutData,ContactData,FooterData,GalleryData} from "../data/data.js"
class Footer{

    render(){
        //creating elemetns
        const footer = document.createElement("footer")
        const socilaLinks=document.createElement("div")
        const facebookLink = document.createElement("a")
        const twitterLink = document.createElement("a")
        const instagramLink = document.createElement("a")
        

        //creating classes
        socilaLinks.classList.add("social-links")
        
        //inner texts
        facebookLink.innerHTML=FooterData.footerIcons[0].name
        twitterLink.innerHTML=FooterData.footerIcons[1].name
        instagramLink.innerHTML=FooterData.footerIcons[2].name

        //appending elements
        footer.appendChild(socilaLinks)
        socilaLinks.appendChild(facebookLink)
        socilaLinks.appendChild(twitterLink)
        socilaLinks.appendChild(instagramLink)
        
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

export {Footer}