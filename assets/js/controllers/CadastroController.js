import Veiculo from '../models/Veiculo.js';
import VeiculoService from '../services/VeiculoService.js';

class CadastroController {
    constructor() {
        console.log('CadastroController inicializado');
        this.veiculoService = new VeiculoService();
        this.form = document.getElementById('formCadastro');
        
        if (!this.form) {
            console.error('Formulário não encontrado');
            return;
        }
        
        this.inicializar();
    }

    inicializar() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.configurarValidacoes();
    }

    configurarValidacoes() {
        // Previne a submissão do form se houver campos inválidos
        this.form.addEventListener('submit', (event) => {
            if (!this.form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            this.form.classList.add('was-validated');
        }, false);

        // Validação customizada para o ano
        const anoInput = document.getElementById('anoFabricacao');
        anoInput.addEventListener('input', () => {
            const anoAtual = new Date().getFullYear();
            const ano = parseInt(anoInput.value);
            
            if (ano < 1900 || ano > anoAtual) {
                anoInput.setCustomValidity(`O ano deve estar entre 1900 e ${anoAtual}`);
            } else {
                anoInput.setCustomValidity('');
            }
        });

        // Validação da URL da imagem
        const urlInput = document.getElementById('urlImagem');
        urlInput.addEventListener('input', () => {
            try {
                new URL(urlInput.value);
                urlInput.setCustomValidity('');
            } catch {
                urlInput.setCustomValidity('Por favor, insira uma URL válida');
            }
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        console.log('Formulário submetido');
        
        if (!this.form.checkValidity()) {
            console.log('Formulário inválido');
            this.form.classList.add('was-validated');
            return;
        }

        try {
            const veiculo = this.criarVeiculo();
            console.log('Veículo criado:', veiculo);
            this.veiculoService.salvarVeiculo(veiculo);
            
            await this.mostrarMensagemSucesso();
            this.form.reset();
            this.form.classList.remove('was-validated');
            
        } catch (error) {
            console.error('Erro ao cadastrar veículo:', error);
            this.mostrarMensagemErro('Erro ao cadastrar veículo. Tente novamente.');
        }
    }

    criarVeiculo() {
        return new Veiculo(
            document.getElementById('marca').value,
            document.getElementById('modelo').value,
            parseInt(document.getElementById('anoFabricacao').value),
            document.getElementById('cor').value,
            document.getElementById('tipo').value,
            parseInt(document.getElementById('quilometragem').value),
            parseInt(document.getElementById('numeroPortas').value),
            document.getElementById('urlImagem').value
        );
    }

    async mostrarMensagemSucesso() {
        const alertHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                Veículo cadastrado com sucesso!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const alertElement = document.createElement('div');
        alertElement.innerHTML = alertHTML;
        this.form.parentElement.insertBefore(alertElement, this.form);

        // Remove o alerta após 3 segundos
        setTimeout(() => {
            alertElement.querySelector('.alert').classList.remove('show');
            setTimeout(() => alertElement.remove(), 150);
        }, 3000);
    }

    mostrarMensagemErro(mensagem) {
        const alertHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${mensagem}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const alertElement = document.createElement('div');
        alertElement.innerHTML = alertHTML;
        this.form.parentElement.insertBefore(alertElement, this.form);
    }
}

// Inicializar o controller
document.addEventListener('DOMContentLoaded', () => {
    new CadastroController();
}); 