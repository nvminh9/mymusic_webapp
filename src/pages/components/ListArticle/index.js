import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

function ListArticle() {
    // chuyển path
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="listArticle">
            {/* List Articles */}
            <div className="row">
                <div className="col l-4 m-4 c-4">
                    <div className="thumbnail">
                        <img
                            src={`https://i.pinimg.com/736x/bb/d3/bc/bbd3bc3fc939bc50cf8f3bc018aa0dd7.jpg`}
                            alt="thumbnail"
                        />
                    </div>
                </div>
                <div className="col l-4 m-4 c-4">
                    <div className="thumbnail">
                        <img
                            src={`https://i.pinimg.com/736x/2f/51/9b/2f519bdf93e3e531e16eef2cc60146a5.jpg`}
                            alt="thumbnail"
                        />
                    </div>
                </div>
                <div className="col l-4 m-4 c-4">
                    <div className="thumbnail">
                        <img
                            src={`https://i.pinimg.com/736x/5d/90/02/5d9002daaf30b912f61cbeea681c95c5.jpg`}
                            alt="thumbnail"
                        />
                    </div>
                </div>
                <div className="col l-4 m-4 c-4">
                    <div className="thumbnail">
                        <img
                            src={`https://i.pinimg.com/736x/f6/44/a3/f644a338626425e8a6f300c8b8b68088.jpg`}
                            alt="thumbnail"
                        />
                    </div>
                </div>
                <div className="col l-4 m-4 c-4">
                    <div className="thumbnail">
                        <img
                            src={`https://i.pinimg.com/736x/fe/07/57/fe07572c7848c96e7f5c37d4fa987c92.jpg`}
                            alt="thumbnail"
                        />
                    </div>
                </div>
                <div className="col l-4 m-4 c-4">
                    <div className="thumbnail">
                        <img
                            src={`https://i.pinimg.com/736x/27/ee/88/27ee88438e2e272184937dc60701030c.jpg`}
                            alt="thumbnail"
                        />
                    </div>
                </div>
                <div className="col l-4 m-4 c-4">
                    <div className="thumbnail">
                        <img
                            src={`https://i.pinimg.com/736x/0a/aa/b4/0aaab41677406057119b9e9c8f5b393c.jpg`}
                            alt="thumbnail"
                        />
                    </div>
                </div>
                <div className="col l-4 m-4 c-4">
                    <div className="thumbnail">
                        <img
                            src={`https://i.pinimg.com/736x/a1/07/51/a10751f167aed32cc9db81a8003c0746.jpg`}
                            alt="thumbnail"
                        />
                    </div>
                </div>
                <div className="col l-4 m-4 c-4">
                    <div className="thumbnail">
                        <img
                            src={`https://i.pinimg.com/736x/e1/d0/d8/e1d0d8d7d19a099f28988f9c93435b86.jpg`}
                            alt="thumbnail"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListArticle;
