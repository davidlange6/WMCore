WMStats.namespace("CampaignSummaryTable");

WMStats.CampaignSummaryTable = function (data, containerDiv) {
    
    var tableConfig = {
        "pageLength": 50,
        "scrollX": "",
        "columns": [
            {"title": "D", 
             "defaultContent": 0,
             "render": function (data, type, row, meta) {
                            return WMStats.Utils.formatDetailButton("detail");
                        }},
            {"title": "L", 
             "defaultContent": 0,
             "render": function (data, type, row, meta) {
                            return WMStats.Utils.formatDetailButton("drill");
                        }},
            { "data": "key", "title": "campaign"},               
            { "render": function (data, type, row, meta) { 
                              return row.summary.summaryStruct.numRequests;
                           }, "title": "requests", "defaultContent": 0, 
            },
            { "defaultContent": 0,
              "title": "job progress", 
              "render": function (data, type, row, meta) { 
                            var campaignSummary = row.summary;
                            var totalJobs = campaignSummary.getWMBSTotalJobs() || 1;
                            var result = (campaignSummary.getJobStatus("success") + campaignSummary.getTotalFailure()) /
                                      totalJobs * 100;
                            return  (result.toFixed(1) + "%");
                          }
            },
            { "defaultContent": 0,
              "title": "event progress", 
              "render": function (data, type, row, meta) { 
                           //TODO this might not needed since input_events should be number not string. (for the legacy record)
                            var totalEvents = row.summary.summaryStruct.totalEvents || 1;
                            var result = row.summary.getAvgEvents() / totalEvents * 100;
                            return (result.toFixed(1) + "%");
                          }
            },
            { "defaultContent": 0,
              "title": "lumi progress", 
              "render": function (data, type, row, meta) { 
                           //TODO this might not needed since input_events should be number not string. (for the legacy record)
                            var totalLumis = row.summary.summaryStruct.totalLumis || 1;
                            var result = row.summary.getAvgLumis() / totalLumis * 100;
                            return (result.toFixed(1) + "%");
                          }
            },
            { "defaultContent": 0,
              "title": "failure rate", 
              "render": function (data, type, row, meta) { 
                           var campaignSummary = row.summary;
                           var totalFailure = campaignSummary.getTotalFailure();
                           var totalJobs = (campaignSummary.getJobStatus("success") + totalFailure) || 1;
                           var result = totalFailure / totalJobs * 100;
                           return (result.toFixed(1)  + "%");
                          }
            },
            { "defaultContent": 0,
              "title": "cool off ", 
              "render": function (data, type, row, meta) {
                            var campaignSummary = row.summary;
                            return (campaignSummary.getTotalCooloff());
                          }
            }
        ]
    };
    tableConfig.data = data.getList();
    
    var filterConfig = {};
    
    return WMStats.Table(tableConfig).create(containerDiv,filterConfig);
};
