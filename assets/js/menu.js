import { Client, Databases, Query } from "https://cdn.jsdelivr.net/npm/appwrite@14.0.0";

// --- CONFIG ---
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6936df5800371a655e8e'); // REPLACE THIS

const databases = new Databases(client);
const DB_ID = 'Fikanova_DB';

// --- MENU BUILDER ---
async function initMenu() {
    try {
        const response = await databases.listDocuments(DB_ID, 'Services', [Query.limit(100)]);
        const services = response.documents;

        // Build Solutions Dropdown (L1 -> L2 -> L3)
        const categories = ['Development', 'Marketing', 'AI and Tech'];
        let solutionsHTML = '<div class="grid grid-cols-3 gap-4 p-4 w-[600px]">';
        
        categories.forEach(cat => {
            solutionsHTML += `<div><h4 class="font-bold text-blue-600 mb-2">${cat}</h4><ul class="space-y-1">`;
            services.filter(s => s.category === cat).forEach(s => {
                solutionsHTML += `<li><a href="/service.html?s=${s.slug}" class="hover:text-blue-500 text-sm text-gray-600">${s.title}</a></li>`;
            });
            solutionsHTML += `</ul></div>`;
        });
        solutionsHTML += '</div>';

        // Inject into DOM (Assuming you have a container with id 'menu-solutions-container')
        const container = document.getElementById('menu-solutions-container');
        if(container) container.innerHTML = solutionsHTML;

    } catch (e) { console.error("Menu Error", e); }
}
initMenu();
