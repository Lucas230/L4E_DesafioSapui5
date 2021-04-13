sap.ui.define([
		"./BaseController"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (BaseController) {
		"use strict";

		return BaseController.extend("desafio.l4e.app.controller.Menu", {
			onInit: function () {

            },
            selectMenu: function(oEvent){
                var item = oEvent.getParameter('item');
                this.getRouter().navTo(item.getKey());
            }
		});
	});
