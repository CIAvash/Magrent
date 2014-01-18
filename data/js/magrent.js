// Constructing base32 and base16 encoder/decoder
const base32 = new Nibbler({
    dataBits: 8,
    codeBits: 5,
    keyString: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
    pad: '='
});

const base16 = new Nibbler({
    dataBits: 8,
    codeBits: 4,
    keyString: '0123456789ABCDEF'
});

const magrent = magnet => {
    // Pattern for matching Bittorrent info hash
    let hashPattern = /xt=urn:btih:([a-f0-9]{40}|[a-z2-7]{32})/i;
    let hash = hashPattern.exec(magnet);
    if (hash) {
        hash[1] = hash[1].toUpperCase();
        // If hash is base32, converts it to base16
        if (hash[1].length === 32)
            hash[1] = base16.encode(base32.decode(hash[1]));

        // Pattern for matching display name in magnet URI
        let magNamePattern = /dn=(.+?)(?=(?:&\w+=)|$)/m;
        let magnetName = magNamePattern.exec(magnet);
        if (magnetName)
            magnetName[1] = magnetName[1].replace(/(?:\+|\.)+/g, ' ');

        return {
            hash: hash[1],
            name: magnetName ? magnetName[1] : null
        };
    }

    return false;
};