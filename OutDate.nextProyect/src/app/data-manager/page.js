'use client'

import React from 'react';
import DataManager from '../../components/ui/DataManager';
import Header from '../../components/layout/Header';

export default function DataManagerPage() {
    return ( <
        div className = "data-manager-page" >
        <
        Header / >
        <
        main className = "main-content" >
        <
        div className = "container" >
        <
        DataManager / >
        <
        /div> < /
        main > <
        /div>
    );
}