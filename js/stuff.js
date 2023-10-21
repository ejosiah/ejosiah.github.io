function multiply(bigNumber, scale) {

    let carry = 0
    let parts = Array.from(bigNumber);
    

    for(let i = parts.length - 1; i >= 0 ; i-- ){
        if(parts[i] === '.') continue;
        let value = carry + Number(parts[i]) * scale;
        carry = Math.floor(value/10);
        parts[i] = (value % 10).toString(); 
    }

    return parts.join('');
        
}