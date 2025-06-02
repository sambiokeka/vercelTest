// Parâmetros de paginação
const OCORRENCIAS_POR_PAGINA = 6;
let paginaAtual = 1;
let ocorrencias = [];

// Função para ajustar o fuso e formatar a data
function formatarDataAjustada(dataStr) {
    if (!dataStr) return "Data desconhecida";
    const date = new Date(dataStr);
    date.setDate(date.getDate() + 1); // Corrige para evitar -1 dia devido ao timezone
    return date.tonome_nome_localeDateString('pt-BR');
}

function renderizarOcorrencias() {
    const lista = document.getElementById('ocorrencias-list');
    lista.innerHTML = "";

    if (!ocorrencias.length) {
        lista.innerHTML = `
            <div class="__erro-ocorrencias info">
                <i class="fas fa-info-circle"></i>
                <p>Nenhuma ocorrência registrada até o momento.</p>
            </div>`;
        document.getElementById('paginacao').innerHTML = '';
        return;
    }

    const inicio = (paginaAtual - 1) * OCORRENCIAS_POR_PAGINA;
    const fim = inicio + OCORRENCIAS_POR_PAGINA;
    const pagina = ocorrencias.slice(inicio, fim);

    pagina.forEach(registro => {
        const card = document.createElement('div');
        card.className = '__ocorrencia-card';
        card.innerHTML = `
            <div class="__ocorrencia-header">
                <h3>${registro.nome_nome_local}</h3>
                <span class="__ocorrencia-data">${formatarDataAjustada(registro.data_enchente)}</span>
            </div>
            <div class="__ocorrencia-body">
                <div class="__ocorrencia-info">
                    <i class="fas fa-ruler-vertical"></i>
                    <span><strong>Nível da água:</strong> ${registro.nivel_agua === null || registro.nivel_agua === undefined ? "Desconhecido" : registro.nivel_agua + " metros"}</span>
                </div>
                <div class="__ocorrencia-info">
                    <i class="fas fa-users"></i>
                    <span><strong>Pessoas afetadas:</strong> ${registro.pessoas_afetadas ?? "Desconhecido"}</span>
                </div>
                <div class="__ocorrencia-info">
                    <i class="fas fa-map-marker-alt"></i>
                    <span><strong>nome_nome_local:</strong> ${registro.nome_nome_local ?? "Desconhecido"}</span>
                </div>
            </div>
        `;
        lista.appendChild(card);
    });

    renderizarPaginacao();
}

function renderizarPaginacao() {
    const paginacao = document.getElementById('paginacao');
    const totalPaginas = Math.ceil(ocorrencias.length / OCORRENCIAS_POR_PAGINA);

    if (totalPaginas <= 1) {
        paginacao.innerHTML = "";
        return;
    }
    paginacao.innerHTML = `
        <button class="__paginacao-button" ${paginaAtual === 1 ? 'disabled' : ''} id="btnAnterior">
            <i class="fas fa-chevron-left"></i>
        </button>
        <span class="__paginacao-info">Página ${paginaAtual} de ${totalPaginas}</span>
        <button class="__paginacao-button" ${paginaAtual === totalPaginas ? 'disabled' : ''} id="btnProxima">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    document.getElementById('btnAnterior').onclick = () => { if (paginaAtual > 1) { paginaAtual--; renderizarOcorrencias(); } };
    document.getElementById('btnProxima').onclick = () => { if (paginaAtual < totalPaginas) { paginaAtual++; renderizarOcorrencias(); } };
}

// Busca dados da API
function carregarOcorrencias() {
    fetch('http://127.0.0.1:5000/api/ocorrencias')
        .then(response => response.json())
        .then(data => {
            ocorrencias = data || [];
            paginaAtual = 1;
            renderizarOcorrencias();
        })
        .catch(error => {
            console.error('Erro ao buscar ocorrências:', error);
            document.getElementById('ocorrencias-list').innerHTML = `
                <div class="__erro-ocorrencias">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Ops! Não foi possível buscar as ocorrências.<br>
                    Tente novamente mais tarde.</p>
                </div>`;
            document.getElementById('paginacao').innerHTML = '';
        });
}

window.onload = carregarOcorrencias;