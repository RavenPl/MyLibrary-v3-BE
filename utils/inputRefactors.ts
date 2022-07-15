export const titleRefactor = (title: string) => {
    return title.charAt(0).toUpperCase() + title.slice(1);
}

export const nameRefactor = (name: string) => {

    const data = name.split(" ");

    for (let i = 0; i < data.length; i++) {
        data[i] = data[i][0].toUpperCase() + data[i].substring(1);
    }

    return data.join(" ");

}