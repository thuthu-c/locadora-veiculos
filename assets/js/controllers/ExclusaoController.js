import VeiculoService from '../services/VeiculoService.js';

class ExclusaoController {
    constructor() {
        this.veiculoService = new VeiculoService();
        this.listaElement = document.getElementById('listaVeiculos');
        this.loadingElement = document.getElementById('loading');
        this.modal = new bootstrap.Modal(document.getElementById('confirmacaoModal'));
        this.veiculoParaExcluir = null;

        this.inicializar();
    }

    inicializar() {
        this.carregarVeiculos();
        this.configurarEventos();
    }

    async carregarVeiculos() {
        try {
            this.mostrarLoading();
            const veiculos = await this.veiculoService.buscarVeiculos();
            this.renderizarVeiculos(veiculos);
        } catch (error) {
            console.error('Erro ao carregar veículos:', error);
            this.mostrarErro('Erro ao carregar os veículos. Tente novamente mais tarde.');
        } finally {
            this.ocultarLoading();
        }
    }

    renderizarVeiculos(veiculos) {
        if (veiculos.length === 0) {
            this.listaElement.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">Nenhum veículo cadastrado</td>
                </tr>
            `;
            return;
        }

        this.listaElement.innerHTML = veiculos.map(veiculo => `
            <tr>
                <td>
                    <img src="${veiculo.urlImagem}" alt="${veiculo.marca} ${veiculo.modelo}" 
                         style="width: 100px; height: 60px; object-fit: cover; border-radius: 4px;">
                </td>
                <td>${veiculo.marca}</td>
                <td>${veiculo.modelo}</td>
                <td>${veiculo.anoFabricacao}</td>
                <td>${veiculo.tipo}</td>
                <td>
                    <button class="btn btn-danger btn-sm excluir-veiculo" data-id="${veiculo.id}">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </td>
            </tr>
        `).join('');

        this.listaElement.querySelectorAll('.excluir-veiculo').forEach(button => {
            button.addEventListener('click', (e) => this.confirmarExclusao(e.target.dataset.id));
        });
    }

    configurarEventos() {
        document.getElementById('confirmarExclusao').addEventListener('click', () => {
            this.excluirVeiculo();
        });
    }

    confirmarExclusao(id) {
        this.veiculoParaExcluir = id;
        this.modal.show();
    }

    async excluirVeiculo() {
        try {
            if (!this.veiculoParaExcluir) return;

            this.veiculoService.excluirVeiculo(this.veiculoParaExcluir);
            this.modal.hide();
            
            await this.carregarVeiculos();
            
            this.mostrarMensagemSucesso();
            
        } catch (error) {
            console.error('Erro ao excluir veículo:', error);
            this.mostrarMensagemErro('Erro ao excluir veículo. Tente novamente.');
        } finally {
            this.veiculoParaExcluir = null;
        }
    }

    mostrarMensagemSucesso() {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show';
        alert.innerHTML = `
            Veículo excluído com sucesso!
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.querySelector('.container').insertBefore(alert, document.querySelector('.table-responsive'));
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    mostrarMensagemErro(mensagem) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show';
        alert.innerHTML = `
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.querySelector('.container').insertBefore(alert, document.querySelector('.table-responsive'));
    }

    mostrarLoading() {
        this.loadingElement.classList.remove('d-none');
        if (this.listaElement.closest('.table-responsive')) {
            this.listaElement.closest('.table-responsive').classList.add('d-none');
        }
    }

    ocultarLoading() {
        this.loadingElement.classList.add('d-none');
        if (this.listaElement.closest('.table-responsive')) {
            this.listaElement.closest('.table-responsive').classList.remove('d-none');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ExclusaoController();
}); 