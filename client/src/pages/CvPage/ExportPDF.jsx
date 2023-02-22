import { Button, theme } from "antd"
import { BsFillCloudDownloadFill } from "react-icons/bs";
import jsPDF from 'jspdf';
import html2canvas from "html2canvas";

const ExportPDF = ({ rootElementId, downloadFileName }) => {

    const themeToken = theme.useToken().token;

    const handleDownloadPDF = async () => {
        const input = document.getElementById(rootElementId);
        html2canvas(input).then(canvas => {
            const imgData = canvas.toDataURL('image/pdf');
            const pdf = new jsPDF('p', 'px', 'a3');
            pdf.addImage(imgData, 'PDF', 10 ,10);
            pdf.save(`${downloadFileName}`);
        })
    };

    return (
        <Button
            size="large"
            style={{
                backgroundColor: themeToken.mainColor,
                color: themeToken.textColor,
                width: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
            onClick={handleDownloadPDF}
        >
            <BsFillCloudDownloadFill
                style={{
                    marginRight: '0.5rem'
                }}
            />
            Tải CV
        </Button>
    )
}

export default ExportPDF;