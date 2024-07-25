const createPerson = function(name, birthday, email, phone, city) {
    return { name, birthday, email, phone, city };
};

const createUser = function(name, birthday, email, phone, city, favoriteMovie) {
    const person = createPerson(name, birthday, email, phone, city);
    return { ...person, favoriteMovie };
};

const createDirector = function(name, birthday, email, phone, city, latestMovie, imdbLink) {
    const person = createPerson(name, birthday, email, phone, city);
    return { ...person, latestMovie, imdbLink };
};

const createCadastro = function(type, data) {
    switch (type) {
        case 'user':
            return createUser(data.name, data.birthday, data.email, data.phone, data.city, data.favoriteMovie);
        case 'director':
            return createDirector(data.name, data.birthday, data.email, data.phone, data.city, data.latestMovie, data.imdbLink);
        default:
            throw new Error('Unknown person type');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const personType = document.querySelector('input[name="userType"]:checked').value;
        const data = {
            name: formData.get('name'),
            birthday: formData.get('birthday'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            city: formData.get('city'),
            favoriteMovie: formData.get('favoriteMovie'),
            latestMovie: formData.get('latestMovie'),
            imdbLink: formData.get('imdbLink')
        };

        let person;
        try {
            person = createCadastro(personType, data);
            savePersonToLocalStorage(personType, person);
            form.reset();
            document.getElementById('userFields').style.display = 'block';
            document.getElementById('directorFields').style.display = 'none';
            alert('Account created successfully!');
        } catch (error) {
            alert(error.message);
        }
    });

    const userTypeInputs = document.querySelectorAll('input[name="userType"]');
    userTypeInputs.forEach(input => {
        input.addEventListener('change', (event) => {
            const userFields = document.getElementById('userFields');
            const directorFields = document.getElementById('directorFields');

            if (event.target.value === 'user') {
                userFields.style.display = 'block';
                directorFields.style.display = 'none';
            } else {
                userFields.style.display = 'none';
                directorFields.style.display = 'block';
            }
        });
    });

    function savePersonToLocalStorage(personType, person) {
        const personData = JSON.stringify(person);
        let people = JSON.parse(localStorage.getItem(personType + 's')) || [];
        people.push(personData);
        localStorage.setItem(personType + 's', JSON.stringify(people));
    }

    const popup = document.getElementById('popup');
    const createAccountButton = document.getElementById('createAccountButton');
    const checkAccountButton = document.getElementById('checkAccountButton');
    const siteTitle = document.getElementById('siteTitle');
    const listContainer = document.getElementById('listContainer');
    const accountList = document.getElementById('accountList');
    const accountPopup = document.getElementById('accountPopup');
    const accountPopupContent = document.getElementById('accountPopupContent');

    createAccountButton.addEventListener('click', () => {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto'; 
        form.style.display = 'block';
    });

    checkAccountButton.addEventListener('click', () => {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto'; 
        listContainer.style.display = 'block';
        accountList.innerHTML = '';
    });

    siteTitle.addEventListener('click', () => {
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden'; 
        form.style.display = 'none';
        listContainer.style.display = 'none';
    });

    document.getElementById('listUsersButton').addEventListener('click', () => {
        listAccounts('user');
    });

    document.getElementById('listDirectorsButton').addEventListener('click', () => {
        listAccounts('director');
    });

    function listAccounts(accountType) {
        accountList.innerHTML = '';
        const accounts = JSON.parse(localStorage.getItem(accountType + 's')) || [];
        accounts.forEach((accountData, index) => {
            const account = JSON.parse(accountData);
            const listItem = document.createElement('li');
            listItem.textContent = account.name;
            listItem.addEventListener('click', () => showAccountDetails(account)); 

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation(); 
                if (confirm(`Are you sure you want to delete ${account.name}?`)) {
                    deleteAccount(accountType, index);
                    listAccounts(accountType); 
                }
            });

            listItem.appendChild(deleteButton);
            accountList.appendChild(listItem);
        });
    }
    
    function deleteAccount(accountType, index) {
        const accounts = JSON.parse(localStorage.getItem(accountType + 's')) || [];
        accounts.splice(index, 1);
        localStorage.setItem(accountType + 's', JSON.stringify(accounts)); 
    }
    
    function showAccountDetails(account) {
        accountPopupContent.innerHTML = `
            <h2>${account.name}</h2>
            <p>Birthday: ${account.birthday}</p>
            <p>Email: ${account.email}</p>
            <p>Phone: ${account.phone}</p>
            <p>City: ${account.city}</p>
            ${account.favoriteMovie ? `<p>Favorite Movie: ${account.favoriteMovie}</p>` : ''}
            ${account.latestMovie ? `<p>Latest Movie: ${account.latestMovie}</p>` : ''}
            ${account.imdbLink ? `<p>IMDb Link: ${account.imdbLink}</p>` : ''}
            <button id="closeAccountPopup">Close</button>
        `;
        accountPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        document.getElementById('closeAccountPopup').addEventListener('click', () => {
            accountPopup.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
});