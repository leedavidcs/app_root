export default {
	"query": {
		"__type": "Query",
		"__kind": "Root",
		"__requestArgs": {
			"__type": "RequestArgs",
			"__kind": "RequestArgs",
			"__args": {
				"symbols": {
					"__type": "String",
					"__list": true,
					"__kind": "Arg",
					"__description": "(a.k.a Tickers) Stock symbols for which to fetch data",
					"__mock": [
						"GOOGL"
					]
				}
			},
			"__groupBy": {
				"symbols": "symbol"
			}
		},
		"__providers": {
			"iexCloud": {
				"__type": "IexCloudProvider",
				"__kind": "Provider",
				"__description": "Market data, provided by [IEX Cloud](https://iexcloud.io/)",
				"__fields": {
					"book": {
						"__type": "IexCloudBook",
						"__list": false,
						"__properties": {
							"quote": {
								"__type": "IexCloudBookQuote",
								"__list": false,
								"__properties": {
									"symbol": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"companyName": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"primaryExchange": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"calculationPrice": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"open": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"openTime": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"openSource": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"close": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"closeTime": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"closeSource": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"high": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"highTime": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"highSource": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"low": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"lowTime": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"lowSource": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"latestPrice": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"latestSource": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"latestTime": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"latestUpdate": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"latestVolume": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"iexRealtimePrice": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"iexRealtimeSize": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"iexLastUpdated": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"delayedPrice": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"delayedPriceTime": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"oddLotDelayedPrice": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"oddLotDelayedPriceTime": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"extendedPrice": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"extendedChange": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"extendedChangePercent": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"extendedPriceTime": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"previousClose": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"previousVolume": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"change": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"changePercent": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"volume": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"iexMarketPercent": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"iexVolume": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"avgTotalVolume": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"iexBidPrice": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"iexBidSize": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"iexAskPrice": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"iexAskSize": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"iexClose": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"iexCloseTime": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"marketCap": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"peRatio": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"week52High": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"week52Low": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"ytdChange": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"lastTradeTime": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"isUSMarketOpen": {
										"__type": "Boolean",
										"__list": false,
										"__kind": "Property"
									}
								},
								"__kind": "Property"
							},
							"trades": {
								"__type": "IexCloudBookTrades",
								"__list": true,
								"__properties": {
									"price": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"size": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"tradeId": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"isISO": {
										"__type": "Boolean",
										"__list": false,
										"__kind": "Property"
									},
									"isOddLot": {
										"__type": "Boolean",
										"__list": false,
										"__kind": "Property"
									},
									"isOutsideRegularHours": {
										"__type": "Boolean",
										"__list": false,
										"__kind": "Property"
									},
									"isSinglePriceCross": {
										"__type": "Boolean",
										"__list": false,
										"__kind": "Property"
									},
									"isTradeThroughExempt": {
										"__type": "Boolean",
										"__list": false,
										"__kind": "Property"
									},
									"timestamp": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									}
								},
								"__kind": "Property"
							},
							"systemEvent": {
								"__type": "IexCloudBookSystemEvent",
								"__list": false,
								"__properties": {
									"systemEvent": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"timestamp": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									}
								},
								"__kind": "Property"
							}
						},
						"__kind": "Field",
						"__args": {},
						"__meta": {
							"credits": 1
						}
					},
					"chart": {
						"__type": "IexCloudChart",
						"__list": true,
						"__properties": {
							"date": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"open": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"close": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"high": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"low": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"volume": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"uOpen": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"uClose": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"uHigh": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"uLow": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"uVolume": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"change": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"changePercent": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"label": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"changeOverTime": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							}
						},
						"__kind": "Field",
						"__args": {},
						"__meta": {
							"credits": 1
						}
					},
					"earnings": {
						"__type": "IexCloudEarnings",
						"__list": false,
						"__properties": {
							"symbol": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"earnings": {
								"__type": "IexCloudEarningsEarnings",
								"__list": true,
								"__properties": {
									"actualEPS": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"consensusEPS": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"announceTime": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"numberOfEstimates": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"EPSSurpriseDollar": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"EPSReportDate": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"fiscalPeriod": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"fiscalEndDate": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"yearAgo": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"yearAgoChangePercent": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"currency": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									}
								},
								"__kind": "Property"
							}
						},
						"__kind": "Field",
						"__args": {},
						"__meta": {
							"credits": 1
						}
					},
					"estimates": {
						"__type": "IexCloudEstimates",
						"__list": false,
						"__properties": {
							"symbol": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"estimates": {
								"__type": "IexCloudEstimatesEstimates",
								"__list": true,
								"__properties": {
									"consensusEPS": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"announceTime": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"numberOfEstimates": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"reportDate": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"fiscalPeriod": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"fiscalEndDate": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"currency": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									}
								},
								"__kind": "Property"
							}
						},
						"__kind": "Field",
						"__args": {},
						"__meta": {
							"credits": 1
						}
					},
					"financials": {
						"__type": "IexCloudFinancials",
						"__list": false,
						"__properties": {
							"symbol": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"financials": {
								"__type": "IexCloudFinancialsFinancials",
								"__list": true,
								"__properties": {
									"reportDate": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"fiscalDate": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"currency": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"grossProfit": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"costOfRevenue": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"operatingRevenue": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"totalRevenue": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"operatingIncome": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"netIncome": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"researchAndDevelopment": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"operatingExpense": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"currentAssets": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"totalAssets": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"totalLiabilities": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"currentCash": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"currentDebt": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"shortTermDebt": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"longTermDebt": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"totalCash": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"totalDebt": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"shareholderEquity": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"cashChange": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"cashFlow": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									}
								},
								"__kind": "Property"
							}
						},
						"__kind": "Field",
						"__args": {},
						"__meta": {
							"credits": 1
						}
					},
					"income": {
						"__type": "IexCloudIncome",
						"__list": false,
						"__properties": {
							"symbol": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"income": {
								"__type": "IexCloudIncomeIncome",
								"__list": true,
								"__properties": {
									"reportDate": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"fiscalDate": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"currency": {
										"__type": "String",
										"__list": false,
										"__kind": "Property"
									},
									"totalRevenue": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"costOfRevenue": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"grossProfit": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"researchAndDevelopment": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"sellingGeneralAndAdmin": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"operatingExpense": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"operatingIncome": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"otherIncomeExpenseNet": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"ebit": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"interestIncome": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"pretaxIncome": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"incomeTax": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"minorityInterest": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"netIncome": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"netIncomeBasic": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									}
								},
								"__kind": "Property"
							}
						},
						"__kind": "Field",
						"__args": {},
						"__meta": {
							"credits": 1
						}
					},
					"logo": {
						"__type": "IexCloudLogo",
						"__list": false,
						"__properties": {
							"url": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							}
						},
						"__kind": "Field",
						"__args": {},
						"__meta": {
							"credits": 1
						}
					},
					"news": {
						"__type": "IexCloudNews",
						"__list": true,
						"__properties": {
							"datetime": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"headline": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"source": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"url": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"summary": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"related": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"image": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"lang": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"hasPaywall": {
								"__type": "Boolean",
								"__list": false,
								"__kind": "Property"
							}
						},
						"__kind": "Field",
						"__args": {},
						"__meta": {
							"credits": 1
						}
					},
					"ohlc": {
						"__type": "IexCloudOhlc",
						"__list": false,
						"__properties": {
							"open": {
								"__type": "IexCloudOhlcOpen",
								"__list": false,
								"__properties": {
									"price": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"time": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									}
								},
								"__kind": "Property"
							},
							"close": {
								"__type": "IexCloudOhlcClose",
								"__list": false,
								"__properties": {
									"price": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									},
									"time": {
										"__type": "Number",
										"__list": false,
										"__kind": "Property"
									}
								},
								"__kind": "Property"
							},
							"high": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"low": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"volume": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"symbol": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							}
						},
						"__kind": "Field",
						"__args": {},
						"__meta": {
							"credits": 1
						}
					},
					"peers": {
						"__type": "String",
						"__list": true,
						"__kind": "Field",
						"__args": {},
						"__meta": {
							"credits": 1
						}
					},
					"previous": {
						"__type": "IexCloudPrevious",
						"__list": false,
						"__properties": {
							"date": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"open": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"close": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"high": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"low": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"volume": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"uOpen": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"uClose": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"uHigh": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"uLow": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"uVolume": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"change": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"changePercent": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"changeOverTime": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"symbol": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							}
						},
						"__kind": "Field",
						"__args": {},
						"__meta": {
							"credits": 1
						}
					},
					"price": {
						"__type": "Number",
						"__list": false,
						"__kind": "Field",
						"__args": {},
						"__meta": {
							"credits": 1
						}
					},
					"quote": {
						"__type": "IexCloudQuote",
						"__list": false,
						"__properties": {
							"symbol": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"companyName": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"primaryExchange": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"calculationPrice": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"open": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"openTime": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"openSource": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"close": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"closeTime": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"closeSource": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"high": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"highTime": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"highSource": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"low": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"lowTime": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"lowSource": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"latestPrice": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"latestSource": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"latestTime": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"latestUpdate": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"latestVolume": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"iexRealtimePrice": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"iexRealtimeSize": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"iexLastUpdated": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"delayedPrice": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"delayedPriceTime": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"oddLotDelayedPrice": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"oddLotDelayedPriceTime": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"extendedPrice": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"extendedChange": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"extendedChangePercent": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"extendedPriceTime": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"previousClose": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"previousVolume": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"change": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"changePercent": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"volume": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"iexMarketPercent": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"iexVolume": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"avgTotalVolume": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"iexBidPrice": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"iexBidSize": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"iexAskPrice": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"iexAskSize": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"iexClose": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"iexCloseTime": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"marketCap": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"peRatio": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"week52High": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"week52Low": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"ytdChange": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"lastTradeTime": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"isUSMarketOpen": {
								"__type": "Boolean",
								"__list": false,
								"__kind": "Property"
							}
						},
						"__kind": "Field",
						"__args": {},
						"__meta": {
							"credits": 1
						}
					},
					"stats": {
						"__type": "IexCloudStats",
						"__list": false,
						"__properties": {
							"week52change": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"week52high": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"week52low": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"marketcap": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"employees": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"day200MovingAvg": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"day50MovingAvg": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"float": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"avg10Volume": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"avg30Volume": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"ttmEPS": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"companyName": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"sharesOutstanding": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"maxChangePercent": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"year5ChangePercent": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"year2ChangePercent": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"year1ChangePercent": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"ytdChangePercent": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"month6ChangePercent": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"month3ChangePercent": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"month1ChangePercent": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"day30ChangePercent": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"day5ChangePercent": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"nextEarningsDate": {
								"__type": "String",
								"__list": false,
								"__kind": "Property"
							},
							"peRatio": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							},
							"beta": {
								"__type": "Number",
								"__list": false,
								"__kind": "Property"
							}
						},
						"__kind": "Field",
						"__args": {},
						"__meta": {
							"credits": 1
						}
					}
				}
			}
		}
	}
};
		