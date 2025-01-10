 // API Base URL
 const apiUrl =
 "https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=20&format=json&origin=*&srsearch=";

// DOM Elements
const button = document.getElementById("searchBtn");
const input = document.getElementById("userText");
let ul = document.createElement("UL");

// Initialize Input
input.focus();

// Event: Clear Input on Click
input.addEventListener("click", () => {
 input.value = "";
 input.focus();
});

// Event: Trigger Search on Enter
input.addEventListener("keydown", (e) => {
 if (e.key === "Enter") {
   clearUl();
   button.click();
 }
});

// Function: Fetch Data from Wikipedia API
async function fetchData(query) {
 try {
   ul.innerHTML = "Loading...";
   document.body.appendChild(ul);

   const response = await fetch(`${apiUrl}${query}`);
   const data = await response.json();

   if (data.error) {
     throw new Error(data.error.info);
   }

   renderResults(data);
 } catch (error) {
   showError(error.message);
 }
}

// Function: Render Search Results
function renderResults(data) {
 const { search } = data.query;

 if (search.length === 0) {
   ul.innerHTML = `<li>No results found. Try a different search term.</li>`;
   return;
 }

 const pageUrl = "http://en.wikipedia.org/?curid=";
 ul.innerHTML = search
   .map(
     ({ pageid, title, snippet }) =>
       `<li>
         <a href="${pageUrl}${pageid}" target="_blank">
           <h1>${title}</h1>
           <h2>${snippet}</h2>
         </a>
       </li>`
   )
   .join("");
}

// Function: Show Error Message
function showError(message) {
 ul.innerHTML = `<li>Error: ${message}</li>`;
}

// Function: Clear UL from the Page
function clearUl() {
 if (ul.parentElement) {
   ul.remove();
 }
 ul.innerHTML = ""; 
}

// Event: Handle Button Click
button.addEventListener("click", () => {
 const query = input.value.trim();

 if (!query) {
   alert("Please enter a search term.");
   return;
 }

 clearUl(); 
 fetchData(query);
});