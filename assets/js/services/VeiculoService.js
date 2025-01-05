class VeiculoService {
    constructor() {
        this.API_URL = 'https://jsonplaceholder.typicode.com/posts';
        this.STORAGE_KEY = 'veiculos';
    }

    async buscarVeiculos() {
        try {
            const veiculosStorage = localStorage.getItem(this.STORAGE_KEY);
            
            if (veiculosStorage) {
                console.log('Veículos encontrados no localStorage:', JSON.parse(veiculosStorage));
                return JSON.parse(veiculosStorage);
            }

            console.log('Buscando veículos da API...');
            const response = await fetch(this.API_URL);
            const data = await response.json();
            
            const veiculos = this.converterDadosAPI(data);
            
            console.log('Salvando veículos no localStorage:', veiculos);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(veiculos));
            
            return veiculos;
        } catch (error) {
            console.error('Erro ao buscar veículos:', error);
            return [];
        }
    }

    salvarVeiculo(veiculo) {
        try {
            const veiculos = this.obterVeiculosStorage();
            veiculos.push(veiculo);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(veiculos));
            console.log('Veículo salvo com sucesso:', veiculo);
            return true;
        } catch (error) {
            console.error('Erro ao salvar veículo:', error);
            throw error;
        }
    }

    excluirVeiculo(id) {
        const veiculos = this.obterVeiculosStorage();
        const veiculosAtualizados = veiculos.filter(v => v.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(veiculosAtualizados));
    }

    obterVeiculosStorage() {
        const veiculos = localStorage.getItem(this.STORAGE_KEY);
        return veiculos ? JSON.parse(veiculos) : [];
    }

    converterDadosAPI(dados) {
        return dados.slice(0, 10).map(post => ({
            id: post.id.toString(),
            marca: ['Toyota', 'Honda', 'Volkswagen', 'Ford', 'Chevrolet'][Math.floor(Math.random() * 5)],
            modelo: `Modelo ${post.id}`,
            anoFabricacao: 2020 + Math.floor(Math.random() * 4),
            cor: ['Preto', 'Branco', 'Prata', 'Vermelho', 'Azul'][Math.floor(Math.random() * 5)],
            tipo: ['Sedan', 'SUV', 'Hatch', 'Pickup'][Math.floor(Math.random() * 4)],
            quilometragem: Math.floor(Math.random() * 100000),
            numeroPortas: [2, 4][Math.floor(Math.random() * 2)],
            urlImagem: `https://picsum.photos/300/200?random=${post.id}`
        }));
    }
}

export default VeiculoService; 