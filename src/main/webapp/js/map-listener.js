// Global marker management for real-time updates
let mapReports = [];
let markerMap = {}; // docId -> marker object
let globalMap = null;

function initMapRealtimeListener(map) {
  globalMap = map;
  
  if (typeof db === 'undefined') {
    console.error('Firestore is not initialized.');
    return;
  }

  const collections = ['reports', 'emergency_reports'];
  let isInitialLoad = true;

  collections.forEach(colName => {
    db.collection(colName).onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const docId = change.doc.id;
        const data = change.doc.data() || {};

        if (change.type === 'added') {
          // Skip initial load
          if (isInitialLoad) {
            return;
          }

          // Get coordinates
          const coordinates = getReportCoordinates({ ...data, docId });
          if (coordinates.latitude === null || coordinates.longitude === null) {
            console.warn(`Report ${docId} has no valid coordinates`);
            return;
          }

          // Check for duplicate
          if (markerMap[docId]) {
            console.warn(`Marker for ${docId} already exists`);
            return;
          }

          // Create report object
          const report = {
            docId: docId,
            source: colName,
            reportId: data.reportId || docId,
            category: data.categoryName || data.category || '-',
            severity: data.severity || data.priority || 'low',
            status: data.status || 'Received',
            createdAt: getTimestampLabel(data.timestamp),
            address: getReportAddress(data),
            latitude: coordinates.latitude,
            longitude: coordinates.longitude
          };

          mapReports.push(report);
          addMarkerToMap(report);
        } else if (change.type === 'modified') {
          // Update existing marker
          const coordinates = getReportCoordinates({ ...data, docId });
          if (coordinates.latitude !== null && coordinates.longitude !== null) {
            const existingReport = mapReports.find(r => r.docId === docId);
            if (existingReport) {
              existingReport.severity = data.severity || data.priority || 'low';
              existingReport.status = data.status || 'Received';
              existingReport.address = getReportAddress(data);
              
              // Update marker
              if (markerMap[docId]) {
                markerMap[docId].getElement().style.backgroundColor = getSeverityColor(existingReport.severity);
                markerMap[docId].setPopup(new mapboxgl.Popup({ offset: 16 }).setHTML(buildPopupContent(existingReport)));
              }
            }
          }
        } else if (change.type === 'removed') {
          // Remove marker from map
          if (markerMap[docId]) {
            markerMap[docId].remove();
            delete markerMap[docId];
          }
          mapReports = mapReports.filter(r => r.docId !== docId);
        }
      });

      isInitialLoad = false;
    });
  });
}

function addMarkerToMap(report) {
  if (!globalMap) {
    console.error('Map not initialized');
    return;
  }

  const markerEl = document.createElement('div');
  markerEl.className = 'status-marker';
  markerEl.style.backgroundColor = getSeverityColor(report.severity);

  const popup = new mapboxgl.Popup({ offset: 16 }).setHTML(buildPopupContent(report));

  const marker = new mapboxgl.Marker(markerEl)
    .setLngLat([report.longitude, report.latitude])
    .setPopup(popup)
    .addTo(globalMap);

  markerMap[report.docId] = marker;
}
