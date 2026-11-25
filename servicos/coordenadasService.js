
function separarEndereco(endereco = "") {
    const textoLimpo = endereco.trim();
    if (!textoLimpo) {
        return { rua: "", numero: "", cidade: "" };
    }

    // Remove CEP e sigla de UF (ex.: "- SP", "/ SP", ", SP") em qualquer posição
    const semEstadoCep = textoLimpo
        .replace(/\b\d{5}-?\d{3}\b/g, "")
        .replace(/(?:\s*[-/]\s*|\s*,\s*)[A-Z]{2}(?=(?:\s|,|$))/gi, "")
        .replace(/,\s*,/g, ",")
        .replace(/^[,\s-]+|[,\s-]+$/g, "")
        .trim();

    // Divide por vírgula ou traço separador de blocos
    const partes = semEstadoCep
        .split(/,|(?:\s+-\s+)/)
        .map((parte) => parte.trim())
        .filter(Boolean);

    let rua = "";
    let numero = "";
    let cidade = "";

    if (partes.length === 1) {
        const matchRuaNum = partes[0].match(/^(.*?)\s+(\d+[A-Za-z0-9/-]*)$/);
        if (matchRuaNum) {
            rua = matchRuaNum[1].trim();
            numero = matchRuaNum[2].trim();
        } else {
            rua = partes[0];
        }
    } else if (partes.length >= 2) {
        const matchPrimeira = partes[0].match(/^(.*?)[,\s]+(\d+[A-Za-z0-9/-]*)$/);
        if (matchPrimeira) {
            rua = matchPrimeira[1].trim();
            numero = matchPrimeira[2].trim();
        } else {
            rua = partes[0];
        }

        if (/^\d+[A-Za-z0-9/-]*$/.test(partes[1])) {
            numero = partes[1];
            cidade = partes[partes.length - 1] || "";
        } else {
            cidade = partes[partes.length - 1] || "";
        }
    }

    if (cidade === rua && partes.length === 2) {
        cidade = "";
    }

    return { rua, numero, cidade };
}

export async function enviarEnderecoParaGeocodingAPI(endereco) {
    const { rua, numero, cidade } = separarEndereco(endereco);

    const params = new URLSearchParams({ limit: "1" });
    if (cidade) params.set("city", cidade);
    if (rua) params.set("street", rua);
    if (numero) params.set("housenumber", numero);

    // Se conseguiu extrair campos estruturados, usa /structured; senão, usa /api?q=
    const temEstruturado = Boolean(rua || cidade);
    const endpoint = temEstruturado
        ? `https://photon.komoot.io/structured?${params.toString()}`
        : `https://photon.komoot.io/api?q=${encodeURIComponent(endereco)}&limit=1`;

    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`Falha na consulta de geocodificação (${response.status}).`);
    }

    const data = await response.json();

    if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].geometry.coordinates;
        return {
            latitude: lat,
            longitude: lng,
            enderecoSeparado: { rua, numero, cidade }
        };
    }

    throw new Error("Endereço não encontrado.");
}