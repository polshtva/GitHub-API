//Алгоритм

// 1 Инициализация переменных
// 2 Обработчик события на поиск + проверка
// 3 запрос к github api (promise, async await)
// 4 если запрос response.ok => из JSON в объект
// 5 Вывод

// История поиска. Алгоритм
// 1  Создание функции для сохранение данных в localStorage
// 2  Проверка
// 3  Массив создать
// 4  Массив преобразовать в JSON и сохранить в localStorage

// 5 Создать функцию для вывода данных из localStorage
// 6 Получить массив и преобразовать в объект
// 7 Вывод данных

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchRes = document.getElementById("search-res");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-btn");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); // сброс отправки на сервер
  const user = searchInput.value.trim();
  console.log(user);
  if (user) {
    getUserGitHub(user);
    searchInput.value = "";
  } else {
    searchRes.textContent = "Введите логин пользователя";
  }
});

// функция выполнения HTTP-запрса к API
//Промисы .then и .catch
// function getUserGitHub(user) {
//     fetch(`https://api.github.com/users/${user}`)
//     .then((response) => {
//         if(response.ok){
//             return response.json();
//         }
//     })
//     .then((res) => console.log(res))
//     .catch((error) => console.error(error))
// }

// async await
async function getUserGitHub(user) {
  try {
    const response = await fetch(`https://api.github.com/users/${user}`); // выполняет http запрос
    const dataUser = await response.json(); // преобразует в объект JSON
    console.log(dataUser);
    displayUserData(dataUser);
  } catch (err) {
    errorUser(err);
  }
}

// Вывод пользователей
function displayUserData(user) {
  searchRes.textContent = "";

  if (user.login == undefined) {
    searchRes.textContent = "<span class='error'>Пользователь не найден</span>";
    return;
  }

  // контейнер для отображения данных пользователя
  const cardInfo = document.createElement("div");
  cardInfo.className = "profile-container";
  searchRes.append(cardInfo);

  //работа с аватаркой
  const avatar = document.createElement("img");
  avatar.src = user.avatar_url;
  cardInfo.append(avatar);

  // имя
  const name = document.createElement("h2");
  name.textContent = user.name ?? user.login;
  cardInfo.append(name);

  // логин
  const login = document.createElement("p");
  login.innerHTML = `Логин: <span class='dec'>@${user.login}<span>`;
  cardInfo.append(login);

  // описание
  const bio = document.createElement("div");
  bio.textContent = `Описание: ${user.bio ?? "Нет данных"}`;
  cardInfo.append(bio);

  //ссылка
  const link = document.createElement("a");
  link.href = user.html_url;
  link.textContent = "Перейти на аккаунт пользователя";
  cardInfo.append(link);
  link.setAttribute("target", "_blank");

  saveData(user);
  loadData();
}

// Вывод ошибки
function errorUser(error) {
  const errBlock = document.createElement("span");
  errBlock.textContent = error;
  errBlock.className = "error";
  searchRes.append(errBlock);
}

// Сохранение данных в localStorage
// Сохранение данных в localStorage (без дублирования)
function saveData(user) {
  let history = JSON.parse(localStorage.getItem("historyData")) ?? [];

  // Проверяем, есть ли уже такой пользователь в истории
  const existingIndex = history.findIndex((item) => item.login === user.login);

  // Если пользователь уже есть, удаляем его из старого места
  if (existingIndex !== -1) {
    history.splice(existingIndex, 1); //Удаляет 1 элемент из массива history на позиции existingIndex
  }

  // Добавляем пользователя в начало массива
  history.unshift(user);

  // Ограничиваем историю 5 элементами
  if (history.length > 5) {
    history = history.slice(0, 5);
  }

  console.log(history);

  localStorage.setItem("historyData", JSON.stringify(history));
}
// Загрузка иcтории данных
function loadData() {
  const history = JSON.parse(localStorage.getItem("historyData")) ?? [];

  historyList.textContent = "";

  if (history.length == 0) {
    const errBlock = document.createElement("span");
    errBlock.textContent = "Истории поиска пока нет";
    errBlock.className = "history-dec";
    historyList.append(errBlock);
  }

  history.forEach((user) => {
    const historyUser = document.createElement("div");
    historyUser.className = "user-container";

    const img = document.createElement("img");
    img.className = "history__img";
    img.src = user.avatar_url;
    img.alt = "Фото не найдено";

    const span = document.createElement("span");
    span.textContent = user.login;
    span.style.marginLeft = "10px";

    historyUser.append(img, span);
    historyList.append(historyUser);

    historyUser.addEventListener("click", () => {
      getUserGitHub(user.login);
    });
  });
}

clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem("historyData");
  historyList.textContent = "";
});

window.addEventListener("load", loadData);
