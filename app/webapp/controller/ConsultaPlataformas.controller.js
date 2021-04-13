sap.ui.define([
        "./BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageBox",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController, JSONModel, MessageBox, Filter, FilterOperator) {
		"use strict";

		return BaseController.extend("desafio.l4e.app.controller.ConsultaPlataformas", {
			onInit: function () {
                this.getRouter().getRoute("ConsultaPlataformas").attachPatternMatched(this.handleRouteMatched, this);

            },
            
            handleRouteMatched: async function(){
                var that = this;
                await
                $.ajax({
                    "url": "/api/plataformas",
                    "method": "GET",
                    success(data){
                        that.getView().setModel(new JSONModel(data), "Plataformas")
                    },
                    error(){
                        MessageBox.error("Não foi possível buscar as Plataformas.")
                    }

                })
            },
            
            // Função 'Excluir'
            onExcluir: async function(oEvent){
                var id = oEvent.getParameter('row').getBindingContext("Plataformas").getObject().id; 
                this.getView().setBusy(true);

                // Método DELETE 
                await
                $.ajax({
                    "url": `/api/plataformas/${id}`,
                    "method": "DELETE",
                    success(data){
                        MessageBox.success("Excluído com sucesso!")
                    },
                    error(){
                        MessageBox.error("Não foi possível excluir a Plataformas.")
                    }

                });
                await this.handleRouteMatched(); 
                this.getView().setBusy(false);

            },

            // Função do botão editar da tabela
            onNavEditarPlataforma: function(oEvent){
                var plataformaId = oEvent.getSource().getBindingContext("Plataformas").getObject().id; 
                this.getRouter().navTo("EditarPlataformas", {id: plataformaId}); 
            },

            // Funções para o Campo de Busca
            _filter : function() {
			var oFilter = null;

			if (this._oGlobalFilter && this._oPriceFilter) {
				oFilter = new Filter([this._oGlobalFilter, this._oPriceFilter], true);
			} else if (this._oGlobalFilter) {
				oFilter = this._oGlobalFilter;
			} else if (this._oPriceFilter) {
				oFilter = this._oPriceFilter;
			}

			this.byId("tablePlataformas").getBinding().filter(oFilter, "Application");
            },
            
            filterGlobally : function(oEvent) {
                var sQuery = oEvent.getParameter("query");
                this._oGlobalFilter = null;

                if (sQuery) {
                    this._oGlobalFilter = new Filter([
                        new Filter("tipo", FilterOperator.Contains, sQuery),
                        new Filter("nome", FilterOperator.Contains, sQuery)
                    ], false);
                }
                this._filter();
            },
            toggleAvailabilityFilter : function(oEvent) {
			    this.byId("availability").filter(oEvent.getParameter("pressed") ? "X" : "");
		    },

		    formatAvailableToObjectState : function(bAvailable) {
			    return bAvailable ? "Success" : "Error";
            }        
		});
	});