
import curiousLogo from '../assets/curious_icon_png.png'
import insvireLogo from '../assets/horizontal logo.png'
// import jsPDF from 'jspdf'
// const doc = new jsPDF({
//     orientation: 'landscape'
// })
export const handleHeader = (doc, type, filters, length) => {
    doc.addImage(curiousLogo, "PNG", 15, 7, 40, 8)
    doc.addImage(insvireLogo, "PNG", 245, 3, 40, 15)

    doc.setFontSize(9);
    doc.text(`Data Type: ${type}`, 15, 20);
    doc.text(`Period: ${filters && filters?.timestamp?.from || ""} until ${filters && filters?.timestamp?.to || ""}`, 15, 24);
    doc.text(`Filter: ${filters && filters?.media || "-"}`, 15, 28);
    doc.text(`Total Data: ${length}`, 15, 32);
}
    ;
