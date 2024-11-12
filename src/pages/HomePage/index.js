import logo from '~/assets/images/logoNoBackground.png';

function HomePage() {
    return (
        <>
            <img src={`${logo}`} style={{ width: '30%' }} />
            <h1>HomePage</h1>
        </>
    );
}

export default HomePage;
