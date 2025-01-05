import VeiculoService from '../services/VeiculoService.js';

class ListagemController {
    constructor() {
        console.log('ListagemController inicializado');
        this.veiculoService = new VeiculoService();
        this.listaElement = document.getElementById('listaVeiculos');
        this.loadingElement = document.getElementById('loading');
        this.filtroMarca = document.getElementById('filtroMarca');
        this.filtroTipo = document.getElementById('filtroTipo');
        this.busca = document.getElementById('busca');
        
        if (!this.listaElement) {
            console.error('Elemento listaVeiculos não encontrado');
            return;
        }
        
        this.inicializar();
    }

    async inicializar() {
        console.log('Iniciando carregamento dos veículos...');
        await this.carregarVeiculos();
        this.configurarFiltros();
    }

    async carregarVeiculos() {
        try {
            this.mostrarLoading();
            const veiculos = await this.veiculoService.buscarVeiculos();
            console.log('Veículos carregados:', veiculos);
            this.renderizarVeiculos(veiculos);
            this.preencherFiltros(veiculos);
        } catch (error) {
            console.error('Erro ao carregar veículos:', error);
            this.mostrarErro('Erro ao carregar os veículos. Tente novamente mais tarde.');
        } finally {
            this.ocultarLoading();
        }
    }

    renderizarVeiculos(veiculos) {
        this.listaElement.innerHTML = veiculos.map(veiculo => `
            <div class="col-md-4 mb-4">
                <div class="veiculo-card">
                    <img src="${veiculo.urlImagem}" alt="${veiculo.marca} ${veiculo.modelo}">
                    <div class="veiculo-info">
                        <h3>${veiculo.marca} ${veiculo.modelo}</h3>
                        <ul class="veiculo-detalhes">
                            <li><strong>Ano:</strong> ${veiculo.anoFabricacao}</li>
                            <li><strong>Cor:</strong> ${veiculo.cor}</li>
                            <li><strong>Tipo:</strong> ${veiculo.tipo}</li>
                            <li><strong>Quilometragem:</strong> ${veiculo.quilometragem.toLocaleString()} km</li>
                            <li><strong>Portas:</strong> ${veiculo.numeroPortas}</li>
                        </ul>
                    </div>
                </div>
            </div>
        `).join('');
    }

    preencherFiltros(veiculos) {
        const marcas = [...new Set(veiculos.map(v => v.marca))];
        this.filtroMarca.innerHTML += marcas.map(marca => 
            `<option value="${marca}">${marca}</option>`
        ).join('');

        const tipos = [...new Set(veiculos.map(v => v.tipo))];
        this.filtroTipo.innerHTML += tipos.map(tipo => 
            `<option value="${tipo}">${tipo}</option>`
        ).join('');
    }

    configurarFiltros() {
        const filtrar = () => {
            const marcaSelecionada = this.filtroMarca.value;
            const tipoSelecionado = this.filtroTipo.value;
            const termoBusca = this.busca.value.toLowerCase();

            const veiculos = this.veiculoService.obterVeiculosStorage();
            const veiculosFiltrados = veiculos.filter(veiculo => {
                const matchMarca = !marcaSelecionada || veiculo.marca === marcaSelecionada;
                const matchTipo = !tipoSelecionado || veiculo.tipo === tipoSelecionado;
                const matchBusca = !termoBusca || 
                    veiculo.marca.toLowerCase().includes(termoBusca) ||
                    veiculo.modelo.toLowerCase().includes(termoBusca);

                return matchMarca && matchTipo && matchBusca;
            });

            this.renderizarVeiculos(veiculosFiltrados);
        };

        this.filtroMarca.addEventListener('change', filtrar);
        this.filtroTipo.addEventListener('change', filtrar);
        this.busca.addEventListener('input', filtrar);
    }

    mostrarLoading() {
        this.loadingElement.classList.remove('d-none');
        this.listaElement.classList.add('d-none');
    }

    ocultarLoading() {
        this.loadingElement.classList.add('d-none');
        this.listaElement.classList.remove('d-none');
    }

    mostrarErro(mensagem) {
        this.listaElement.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-danger" role="alert">
                    ${mensagem}
                </div>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ListagemController();
}); 