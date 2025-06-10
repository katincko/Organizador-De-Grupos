// filepath: c:\Users\Joca\Desktop\React\Organizador de grupo\script.js
document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('namesInput');
    const groupCountInput = document.getElementById('groupCount');
    const generateButton = document.getElementById('generateGroups');
    const groupContainer = document.getElementById('groupsContainer');

    let allowAddBtn = false; // controla se pode mostrar o botão de adicionar
    let revealedOverlays = [];

    // Atualiza os cards ao mudar a quantidade de grupos
    groupCountInput.addEventListener('input', () => {
        const groupCount = parseInt(groupCountInput.value);
        allowAddBtn = false;
        if (!isNaN(groupCount) && groupCount > 0) {
            displayGroups(Array.from({ length: groupCount }, () => []));
        }
    });

    // Ao clicar em ENVIAR
    generateButton.addEventListener('click', () => {
        const names = nameInput.value.split('\n').map(name => name.trim()).filter(name => name);
        const groupCount = parseInt(groupCountInput.value);

        if (names.length === 0 || isNaN(groupCount) || groupCount <= 0) {
            alert('Preencha os nomes e a quantidade de grupos.');
            return;
        }

        const groups = createGroups(names, groupCount);
        revealedOverlays = Array(groupCount).fill(false);
        allowAddBtn = true; // só permite adicionar após enviar
        displayGroups(groups, true);
    });

    document.getElementById('downloadNames').addEventListener('click', () => {
        const names = document.getElementById('namesInput').value;
        const blob = new Blob([names], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nomes.txt';
        a.click();
        URL.revokeObjectURL(url);
    });

    function createGroups(names, groupCount) {
        // Embaralha os nomes para aleatoriedade
        for (let i = names.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [names[i], names[j]] = [names[j], names[i]];
        }
        const groups = Array.from({ length: groupCount }, () => []);
        names.forEach((name, index) => {
            groups[index % groupCount].push(name);
        });
        return groups;
    }

    function displayGroups(groups, fill = false) {
        // Ajusta o tamanho do array de overlays para o número de grupos
        if (revealedOverlays.length !== groups.length) {
            revealedOverlays = Array(groups.length).fill(false);
        }

        groupContainer.innerHTML = '';
        groups.forEach((group, groupIdx) => {
            const groupCard = document.createElement('div');
            groupCard.className = 'group-card';
            groupCard.style.position = 'relative';

            const title = document.createElement('h3');
            title.textContent = `Grupo ${groupIdx + 1}`;
            groupCard.appendChild(title);

            const ul = document.createElement('ul');
            ul.className = 'group-list';
            ul.style.visibility = revealedOverlays[groupIdx] ? 'visible' : 'hidden';

            group.forEach((name, idx) => {
                const li = document.createElement('li');
                li.textContent = name;

                const removeBtn = document.createElement('span');
                removeBtn.textContent = '✖';
                removeBtn.className = 'remove-name';
                removeBtn.onclick = () => {
                    group.splice(idx, 1);
                    displayGroups(groups, true);
                };
                li.appendChild(removeBtn);

                ul.appendChild(li);
            });
            groupCard.appendChild(ul);

            // Overlay individual
            const overlay = document.createElement('div');
            overlay.className = 'card-overlay';
            overlay.innerText = 'Clique para revelar!';
            overlay.style.opacity = revealedOverlays[groupIdx] ? '0' : '1';
            overlay.style.pointerEvents = revealedOverlays[groupIdx] ? 'none' : 'auto';
            overlay.style.transition = 'opacity 0.7s ease';
            overlay.style.display = group.length && !revealedOverlays[groupIdx] ? 'flex' : 'none';

            overlay.addEventListener('click', () => {
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
                revealedOverlays[groupIdx] = true;
                setTimeout(() => {
                    overlay.style.display = 'none';
                    ul.style.visibility = 'visible';
                }, 700);
            });

            groupCard.appendChild(overlay);

            // Botão de adicionar nome (só aparece após ENVIAR)
            if (allowAddBtn) {
                const addBtn = document.createElement('button');
                addBtn.textContent = '+';
                addBtn.className = 'add-name-btn';
                addBtn.onclick = () => {
                    const nome = prompt('Digite o nome:');
                    if (nome && nome.trim()) {
                        group.push(nome.trim());
                        displayGroups(groups, true);
                    }
                };
                groupCard.appendChild(addBtn);
            }

            groupContainer.appendChild(groupCard);
        });
    }
});