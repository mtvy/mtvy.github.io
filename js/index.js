
function typeWriter(name, char_ind, txt, delay) {

    if (char_ind < txt.length) 
    {
        document.getElementById(name).innerHTML += txt.charAt(char_ind);
        char_ind++;
        setTimeout(typeWriter, delay, name, char_ind, txt, delay);
    }

}

async function enterColor() {

    let elem = document.getElementById("rev_color");
     
    for (let df = 1; df < 236; df += 5)
    {
        if (255 - df > 34)
        {
            elem.style.backgroundColor = `rgb(${255 - df}, ${255 - df}, ${255 - df})`;
        }
        else if (255 - df > 27)
        {
            elem.style.backgroundColor = `rgb(${255 - df}, ${255 - df}, 34)`;
        }
        else if (255 - df > 22)
        {
            elem.style.backgroundColor = `rgb(${255 - df}, 27, 29)`;
        }
        await new Promise((resolve, _) => setTimeout(resolve, 10));
    }
    
}

(() => {
    enterColor(); 
    typeWriter("logo", 0, "MTVY.", 69);
})()
