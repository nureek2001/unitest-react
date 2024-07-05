import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import { TestResults } from '../TestResults/TestResults';
// Create Document Component
function PdfDocument() {
	const reportTemplateRef = useRef(null);

	const handleGeneratePdf = () => {
		const doc = new jsPDF({
			format: 'a4',
			unit: 'px',
		});

		// Adding the fonts.
		doc.setFont('Times-Roman', 'normal');

		doc.html(reportTemplateRef.current, {
			async callback(doc) {
				await doc.save('document');
			},
		});
	};

	return (
		<div>
			<button className="button" onClick={handleGeneratePdf}>
				Generate PDF
			</button>
			<div ref={reportTemplateRef}>
				<ReportTemplate />
			</div>
		</div>
	);
}

export default App;

