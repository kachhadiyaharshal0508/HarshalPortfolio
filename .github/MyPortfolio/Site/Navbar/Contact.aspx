<%@ Page Title="" Language="C#" MasterPageFile="~/Site/Site.Master" AutoEventWireup="true" CodeBehind="Contact.aspx.cs" Inherits="MyPortfolio.Site.Navbar.Contact" %>

<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">

    <script src="https://unpkg.com/react@15.5.4/dist/react.js"></script>
    <script src="https://unpkg.com/react-dom@15.5.4/dist/react-dom.js"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <!-- BABEL LIBRARY -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.25.0/babel.min.js"></script>

    <script type="text/babel" src="/site/ReactJs/Contact.js"></script>

    <div id="root"></div>
</asp:Content>
