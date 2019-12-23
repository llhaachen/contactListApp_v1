class Contact {
    constructor(name, email, number) {
        this.name = name;
        this.email = email;
        this.number = number;
    }
}

class UI {
    static displayContacts() {
        const contacts = Store.getContacts();
        contacts.forEach((contact) => UI.addContactToList(contact));
    }
    static addContactToList(contact) {
        const list = document.querySelector('#contact-list');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.number}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }
    static removeContact(el) {
        el.parentElement.parentElement.remove();

        UI.showAlert('Contact removed!','success');
    }
    static clearFields(){
        document.querySelector('#name').value = '';
        document.querySelector('#email').value = '';
        document.querySelector('#number').value = '';
    }
    static showAlert(message, className) {
        const container = document.querySelector('.container');
        const form = document.querySelector('#contact-form');
        const div = document.createElement('div');

        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }
}

class Store {
    static getContacts() {
        let contacts;
        if(localStorage.getItem('contacts') === null) {
            contacts = [];
        } else {
            contacts = JSON.parse(localStorage.getItem('contacts'));
        }
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

document.addEventListener('DOMContentLoaded', UI.displayContacts());

document.querySelector('#contact-list').addEventListener('click', (e) => {
    
    if(e.target.classList.contains('delete')) {
        const number = e.target.parentElement.previousElementSibling;
        const email = e.target.parentElement.previousElementSibling.previousElementSibling;

        UI.removeContact(e.target);
        Store.deleteContact(number.textContent, email.textContent);
    }
});

document.querySelector('#contact-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const number = document.querySelector('#number').value;

    if(name == '' || number == '') {
        UI.showAlert('The name and number fields cannot be blank.','danger');
    } else {
        const contact = new Contact(name, email, number);

        Store.addContact(contact);

        UI.addContactToList(contact);

        UI.showAlert('Contact added!','success');

        UI.clearFields();
    }    
});