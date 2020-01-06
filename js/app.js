// Object Class
class Contact {
    constructor(name, email, number) {
        this.name = name;
        this.email = email;
        this.number = number;
    }
}

// Front-End
class UI {
    static displayHeader(letter) {
        const list = document.querySelector('.collection');
        const div = document.createElement('div');
        div.classList.add('part');
        div.innerHTML = `<li class="collection-header"><h5>${letter}</h5></li>`;
        list.insertAdjacentElement('beforeend', div);
    }

    static displayContacts() {
        const contacts = Store.getContacts();
        contacts.forEach((contact) => UI.addContactToList(contact));
        UI.hideEmpty();
    }

    static addContactToList(contact) {   
        let list = document.createElement('li');
        list.classList.add('collection-item');
        list.innerHTML = `<span class="listname">${contact.name}</span>
        <div class="itembox">
        <span class="listmail">${contact.email}</span>
        <span class="listnum">${contact.number}</span>
        <a href="#" class="listbutton delete">Delete</a></div>`;
        
        let header = [...document.getElementsByClassName('collection-header')];
        let firstLetter = contact.name.slice(0, 1).toUpperCase();
        
        header.forEach((head) => {
            if(head.innerText == firstLetter) {            
            head.parentElement.insertAdjacentElement('beforeend', list);
            }
        })
        UI.hideEmpty();      
    }

    static removeContact(el) {
        el.parentElement.parentElement.remove();
        
        UI.showAlert('Contact removed!','success');
        UI.hideEmpty();
    }

    static modalToggle() {
        const buttonExpand = document.querySelector('.button-expand');
        const addcontact = document.querySelector('.add-contact');

        if(!(addcontact.classList.contains('open'))) {
            addcontact.classList.add('open');
            buttonExpand.classList.add('open');
        } else {
            addcontact.classList.remove('open');
            buttonExpand.classList.remove('open');
        }
    }

    static filterNames() {
        const filterInput = document.getElementById('filterInput').value.toLowerCase();
        const parts = [...document.getElementsByClassName('part')];
        parts.forEach((part) => {
            let collecItems = [...part.getElementsByClassName('collection-item')];
            collecItems.forEach((item) => {
                const itemText = item.querySelector('.listname').innerText.toLowerCase();
    
                if(itemText.indexOf(filterInput)!= -1){
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            })         
        })
        UI.hideEmpty();
    }

    static clearFields(){
        document.querySelector('#name').value = '';
        document.querySelector('#email').value = '';
        document.querySelector('#number').value = '';
    }

    static showAlert(message, className) {
        const container = document.querySelector('.contact-list-box');
        const form = document.querySelector('#contacts');
        const div = document.createElement('div');

        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 1500);
    }

    static hideEmpty() {
        const parts = [...document.getElementsByClassName('part')];
        parts.forEach((part) => {
            let num = 0;
            let collecItems = [...part.getElementsByClassName('collection-item')];
            collecItems.forEach((item) => {
                if(item.style.display == 'none'){
                    num = num +1;
                }
            })
            if(num == collecItems.length) {
                part.style.display = 'none';
            } else {
                part.style.display = 'block';
            }
        })
    }
}

// Back-end
class Store {
    static getContacts() {
        let contacts;
        if(localStorage.getItem('contacts') === null) {
            contacts = [];
        } else {
            contacts = JSON.parse(localStorage.getItem('contacts'));
        }
        contacts.sort((a, b) => {
            let aSt = a.name.toLowerCase();
            let bSt = b.name.toLowerCase();
            if(aSt > bSt) {
                return 1;
            } else {
                return -1;
            }
        });
        return contacts;
    }
    static addContact(contact) {
        const contacts = Store.getContacts();
        contacts.push(contact);
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
    static deleteContact(number, email) {
        const contacts = Store.getContacts();
        contacts.forEach((contact, index) => {
            if(contact.number === number && contact.email === email) {
                contacts.splice(index, 1);
            }
        });
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }

}

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
alphabet.forEach((letter) => {
    UI.displayHeader(letter);
});

// Event Listeners

// Display Contacts
document.addEventListener('DOMContentLoaded', UI.displayContacts());

// Add Contacts
document.querySelector('#contact-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const number = document.querySelector('#number').value;

    if(name == '' || number == '') {
        const container = document.querySelector('.add-contact-modal');
        const form = document.querySelector('#contact-form');
        const div = document.createElement('div');

        div.className = `alert alert-danger`;
        div.appendChild(document.createTextNode('Empty fields!'));
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 1200);
    } else {
        const contact = new Contact(name, email, number);

        Store.addContact(contact);

        UI.addContactToList(contact);

        UI.showAlert('Contact added!','success');

        UI.clearFields();

        document.querySelector('.add-contact').classList.remove('open');
        document.querySelector('.button-expand').classList.remove('open');
    }    
});

// Delete Contacts
document.querySelector('#contacts').addEventListener('click', (e) => {
    
    if(e.target.classList.contains('delete')) {
        const number = e.target.previousElementSibling;
        const email = e.target.previousElementSibling.previousElementSibling;

        UI.removeContact(e.target); 
        Store.deleteContact(number.textContent, email.textContent);
    }
});

// Toggle Add Contact Modal
document.querySelector('.button-expand').addEventListener('click', UI.modalToggle);

// Filter Contacts
document.querySelector('#filterInput').addEventListener('keyup', UI.filterNames);

// Show/Hide Contact Details
document.querySelector('.collection').addEventListener('click', (e) => {
    if((e.target.classList.contains('collection-item'))) {
        let itembox = e.target.querySelector('.itembox').classList;
        if(itembox.contains('open')) {
            itembox.remove('open');
        } else {
            itembox.add('open');
        }
    }
})
