class Veiculo {
    constructor(marca, modelo, anoFabricacao, cor, tipo, quilometragem, numeroPortas, urlImagem) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.marca = marca;
        this.modelo = modelo;
        this.anoFabricacao = anoFabricacao;
        this.cor = cor;
        this.tipo = tipo;
        this.quilometragem = quilometragem;
        this.numeroPortas = numeroPortas;
        this.urlImagem = urlImagem;
    }
}

export default Veiculo; 