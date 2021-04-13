sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    function (BaseController, JSONModel, MessageBox) {
        "use strict";
        
        return BaseController.extend("desafio.l4e.app.controller.CadastroPlataformas", {
            onInit: function () {
                // Referenciando a rota de cadastro
                this.getRouter().getRoute("CadastroPlataformas").attachPatternMatched(this.handleRouteMatched, this);
                // Referenciando a rota de edição
                this.getRouter().getRoute("EditarPlataformas").attachPatternMatched(this.handleRouteMatchedEditarPlataforma, this);
            },

            // Rota de cadastro
            handleRouteMatched: function () {
                this.getView().setModel(new JSONModel({
                    "status": "A"
                }), "Plataforma");
            },

            // Rota de edição
            handleRouteMatchedEditarPlataforma: async function () {
                var that = this;
                var id = this.getRouter().getHashChanger().getHash().split("/")[1];
                this.getView().setBusy(true);
                await
                    $.ajax({
                        "url": `/api/plataformas/${id}`, 
                        "method": "GET",
                        success(data) {
                            that.getView().setModel(new JSONModel(data), "Plataforma"); 
                        },
                        error() {
                            MessageBox.error("Não foi possível buscar os Plataformas.");
                        }
                    });
                this.getView().setBusy(false);
            },

            // Função do Switch
            onSwitch: function (oEvent) {
                this.getView().getModel("Plataforma").setProperty("/status", oEvent.getSource().getState() === true ? "A" : "I");
            },
            // Função do botão Confirmar
            onConfirmar: async function () {
                var oPlataforma = this.getView().getModel("Plataforma").getData();
                var that = this;
                console.log(oPlataforma)

                if (this.getRouter().getHashChanger().getHash().search("EditarPlataformas") === 0) {
                    await $.ajax(`/api/plataformas/${oPlataforma.id}`, { 
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify({
                            "nome": oPlataforma.nome,
                            "tipo": oPlataforma.tipo,
                            "status": oPlataforma.status
                        }),
                        success() {
                            MessageBox.success("Editado com êxito!", {
                                onClose: function () {
                                    that.getRouter().navTo("ConsultaPlataformas");
                                }
                            });
                        },
                        error() {
                            MessageBox.error("Não foi possível editar a plataforma.");
                        }
                    });

                } else {

                    this.getView().setBusy(true);
                    // Método POST 
                    await $.ajax("/api/plataformas", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(oPlataforma),
                        success() {
                            MessageBox.success("Salvo com sucesso!");
                        },
                        error() {
                            MessageBox.error("Não foi possível salvar a plataforma.");
                        }
                    })

                    this.getView().setBusy(false);

                }
            },

            // Função do botão Cancelar
            onCancelar: function () {
                if (this.getRouter().getHashChanger().getHash().search("EditarPlataformas") === 0) {
                    this.getRouter().navTo("ConsultaPlataformas");
                } else {
                    this.getView().setModel(new JSONModel({ "status": "A" }), "Plataforma");
                }
            }
        });
    });
