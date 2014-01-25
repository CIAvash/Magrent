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

const magrent = input => {
    let hash;
    let torrentName = '';
    let fileName = '';

    if (/^magnet:\?/i.test(input)) {
        // Pattern for matching Bittorrent info hash
        const magnetPattern = /xt=urn:btih:([a-z0-9]+)/i;
        const hashMatch = magnetPattern.exec(input);
        if (hashMatch)
            hash = hashMatch[1];
        else
            return false;

        // Pattern for matching display name in magnet URI
        let magNamePattern = /dn=(.+?)(?=(?:&\w+=)|$)/m;
        let magnetName = magNamePattern.exec(input);        
        if (magnetName) {
            torrentName = magnetName[1].replace(/[+.\-]+/g, ' ');
            // Replace separators with '.' and make sure it's a valid filename
            fileName = decodeURIComponent(magnetName[1]).replace(/[+\-|:\\\/*?<>"_ ]+/g, '.');
        }
    }
    else {
        hash = input;
    }

    
    hash = hash.toUpperCase();

    if (hash.length === 32 && /[A-Z2-7]{32}/.test(hash)) {
        // If hash is base32, convert it to base16
        hash = base16.encode(base32.decode(hash));
    }
    else if (!(hash.length === 40 && /[A-F0-9]{40}/.test(hash))) {
        return false;
    }

    return {
        hash: hash,
        name: torrentName,
        filename: fileName
    };
};