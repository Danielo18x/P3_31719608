export default function generateSlug(name) {
    return name
        .toLowerCase() // todo en minúsculas
        .normalize("NFD") // separar acentos
        .replace(/[\u0300-\u036f]/g, "") // quitar acentos
        .replace(/[^a-z0-9\s-]/g, "") // quitar caracteres no alfanuméricos
        .trim() // quitar espacios al inicio y final
        .replace(/\s+/g, "-") // espacios → guiones
        .replace(/-+/g, "-"); // guiones repetidos → uno solo
}