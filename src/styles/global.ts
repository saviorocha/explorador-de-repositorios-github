import { createGlobalStyle } from 'styled-components';

// import githubBackground from '..assets/github-background.svg';
export default createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
    }

    body {
        background: #f0f0f5;
        --webkit-font-font-smoothing: antialised;
    }

    body, :-ms-input-placeholder, button {
        font: 16px 'Kdam Thmor' sans-serif;
    }

    #root {
        max-width: 960px;
        margin: 0 auto;
        padding:  40px 20px
    }

    button {
        cursor: pointer;
    }
`;
