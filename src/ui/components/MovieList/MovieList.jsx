import React, { useEffect } from "react";
import './MovieList.css';
//import './MovieCard.jsx';
import MovieCard from "./MovieCard";

const MovieList = () => {
    const trendingMoviesData = {
"page": 1,
"results": [
{
"adult": false,
"backdrop_path": "/5h2EsPKNDdB3MAtOk9MB9Ycg9Rz.jpg",
"id": 1084242,
"title": "Zootopia 2",
"original_title": "Zootopia 2",
"overview": "After cracking the biggest case in Zootopia's history, rookie cops Judy Hopps and Nick Wilde find themselves on the twisting trail of a great mystery when Gary De’Snake arrives and turns the animal metropolis upside down. To crack the case, Judy and Nick must go undercover to unexpected new parts of town, where their growing partnership is tested like never before.",
"poster_path": "/3Wg1LBCiTEXTxRrkNKOqJyyIFyF.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
16,
10751,
35,
12,
9648
],
"popularity": 555.4388,
"release_date": "2025-11-26",
"video": false,
"vote_average": 7.739,
"vote_count": 324
},
{
"adult": false,
"backdrop_path": "/6bzabqH399ioM3nZScwZtzGaHIy.jpg",
"id": 533533,
"title": "TRON: Ares",
"original_title": "TRON: Ares",
"overview": "A highly sophisticated Program called Ares is sent from the digital world into the real world on a dangerous mission, marking humankind's first encounter with A.I. beings.",
"poster_path": "/chpWmskl3aKm1aTZqUHRCtviwPy.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
878,
12,
28
],
"popularity": 446.5362,
"release_date": "2025-10-08",
"video": false,
"vote_average": 6.464,
"vote_count": 507
},
{
"adult": false,
"backdrop_path": "/lZYMXx74pWmbj5Q5jp1QaMvmuuR.jpg",
"id": 1180831,
"title": "Troll 2",
"original_title": "Troll 2",
"overview": "When a dangerous new troll unleashes devastation across their homeland, Nora, Andreas and Major Kris embark on their most perilous mission yet.",
"poster_path": "/p6xAExLNFbHcLfvSuvLPoM8aqZU.jpg",
"media_type": "movie",
"original_language": "no",
"genre_ids": [
28,
14,
53
],
"popularity": 440.9976,
"release_date": "2025-11-30",
"video": false,
"vote_average": 6.882,
"vote_count": 102
},
{
"adult": false,
"backdrop_path": "/tN3pTxkQoP96wtaEahYuRVdUWb2.jpg",
"id": 701387,
"title": "Bugonia",
"original_title": "Bugonia",
"overview": "Two conspiracy obsessed young men kidnap the high-powered CEO of a major company, convinced that she is an alien intent on destroying planet Earth.",
"poster_path": "/oxgsAQDAAxA92mFGYCZllgWkH9J.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
878,
80
],
"popularity": 116.8055,
"release_date": "2025-10-23",
"video": false,
"vote_average": 7.5,
"vote_count": 609
},
{
"adult": false,
"backdrop_path": "/haAekI7zBtffqILr90DkviTe9fk.jpg",
"id": 1261825,
"title": "Oh. What. Fun.",
"original_title": "Oh. What. Fun.",
"overview": "Claire Clauster organizes a special Christmas outing when her family forgets her in the shuffle. By the time they realize their mistake, she’s gone missing. Their Christmas is in jeopardy, but Claire has other plans.",
"poster_path": "/qynCyBKCJUUcj4wo4PE2aQVvote.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
35
],
"popularity": 53.7385,
"release_date": "2025-12-02",
"video": false,
"vote_average": 7.344,
"vote_count": 16
},
{
"adult": false,
"backdrop_path": "/ebyxeBh56QNXxSJgTnmz7fXAlwk.jpg",
"id": 1242898,
"title": "Predator: Badlands",
"original_title": "Predator: Badlands",
"overview": "Cast out from his clan, a young Predator finds an unlikely ally in a damaged android and embarks on a treacherous journey in search of the ultimate adversary.",
"poster_path": "/ef2QSeBkrYhAdfsWGXmp0lvH0T1.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
28,
878,
12
],
"popularity": 196.4462,
"release_date": "2025-11-05",
"video": false,
"vote_average": 7.4,
"vote_count": 537
},
{
"adult": false,
"backdrop_path": "/ciE4FoNns0MAtWaxBBlQUFhuQMf.jpg",
"id": 1441563,
"title": "My Secret Santa",
"original_title": "My Secret Santa",
"overview": "A single mom needs a job. A ski resort needs a Santa. Disguised as a St. Nick lookalike, can Taylor fool a charming hotel heir into ho-ho-hiring her?",
"poster_path": "/y3kM10ksmRFVA3ylCVBAlukPhKC.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
35,
10749
],
"popularity": 24.9627,
"release_date": "2025-12-02",
"video": false,
"vote_average": 7.4,
"vote_count": 7
},
{
"adult": false,
"backdrop_path": "/54BOXpX2ieTXMDzHymdDMnUIzYG.jpg",
"id": 1228246,
"title": "Five Nights at Freddy's 2",
"original_title": "Five Nights at Freddy's 2",
"overview": "One year since the supernatural nightmare at Freddy Fazbear's Pizza, the stories about what transpired there have been twisted into a campy local legend, inspiring the town's first ever Fazfest. With the truth about what transpired kept from her, Abby sneaks out to reconnect with Freddy, Bonnie, Chica, and Foxy, setting into motion a terrifying series of events that will reveal dark secrets about the true origin of Freddy's, and unleash a long-forgotten horror hidden away for decades.",
"poster_path": "/am6O7221qGtb5ba5uJKw7PfPZkJ.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
27,
53
],
"popularity": 70.4206,
"release_date": "2025-12-03",
"video": false,
"vote_average": 6.5,
"vote_count": 16
},
{
"adult": false,
"backdrop_path": "/iN41Ccw4DctL8npfmYg1j5Tr1eb.jpg",
"id": 83533,
"title": "Avatar: Fire and Ash",
"original_title": "Avatar: Fire and Ash",
"overview": "In the wake of the devastating war against the RDA and the loss of their eldest son, Jake Sully and Neytiri face a new threat on Pandora: the Ash People, a violent and power-hungry Na'vi tribe led by the ruthless Varang. Jake's family must fight for their survival and the future of Pandora in a conflict that pushes them to their emotional and physical limits.",
"poster_path": "/g96wHxU7EnoIFwemb2RgohIXrgW.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
878,
12,
14
],
"popularity": 61.7769,
"release_date": "2025-12-17",
"video": false,
"vote_average": 0,
"vote_count": 0
},
{
"adult": false,
"backdrop_path": "/otSXrUWOTX7tTigLBMFKOV8n47r.jpg",
"id": 1246049,
"title": "Dracula",
"original_title": "Dracula",
"overview": "When a 15th-century prince denounces God after the devastating loss of his wife, he inherits an eternal curse: he becomes Dracula. Condemned to wander the centuries, he defies fate and death itself, guided by a single hope — to be reunited with his lost love.",
"poster_path": "/ykyRfv7JDofLxXLAwtLXaSuaFfM.jpg",
"media_type": "movie",
"original_language": "fr",
"genre_ids": [
27,
14,
10749
],
"popularity": 255.3248,
"release_date": "2025-07-30",
"video": false,
"vote_average": 7.076,
"vote_count": 506
},
{
"adult": false,
"backdrop_path": "/l8pwO23MCvqYumzozpxynCNfck1.jpg",
"id": 967941,
"title": "Wicked: For Good",
"original_title": "Wicked: For Good",
"overview": "As an angry mob rises against the Wicked Witch, Glinda and Elphaba will need to come together one final time. With their singular friendship now the fulcrum of their futures, they will need to truly see each other, with honesty and empathy, if they are to change themselves, and all of Oz, for good.",
"poster_path": "/si9tolnefLSUKaqQEGz1bWArOaL.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
14,
12,
10749
],
"popularity": 162.1535,
"release_date": "2025-11-19",
"video": false,
"vote_average": 6.751,
"vote_count": 363
},
{
"adult": false,
"backdrop_path": "/2OHa6ukEq3Hce7Pc2kvu8wkmMFY.jpg",
"id": 7451,
"title": "xXx",
"original_title": "xXx",
"overview": "Xander Cage is your standard adrenaline junkie with no fear and a lousy attitude. When the US Government recruits him to go on a mission, he's not exactly thrilled. His mission: to gather information on an organization that may just be planning the destruction of the world, led by the nihilistic Yorgi.",
"poster_path": "/xeEw3eLeSFmJgXZzmF2Efww0q3s.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
28,
12,
53,
80,
18
],
"popularity": 57.1501,
"release_date": "2002-08-09",
"video": false,
"vote_average": 5.976,
"vote_count": 4677
},
{
"adult": false,
"backdrop_path": "/y6PLMIoHOP365rNDflD9VgnoALU.jpg",
"id": 1218762,
"title": "Jingle Bell Heist",
"original_title": "Jingle Bell Heist",
"overview": "Two down-on-their-luck hourly workers team up to rob a posh London department store on Christmas Eve. Will they steal each other's hearts along the way?",
"poster_path": "/rVOQF2Ucekug1B80A9crVx7Jn90.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
10749,
80,
35
],
"popularity": 51.6435,
"release_date": "2025-11-25",
"video": false,
"vote_average": 6.077,
"vote_count": 78
},
{
"adult": false,
"backdrop_path": "/zpEWFNqoN8Qg1SzMMHmaGyOBTdW.jpg",
"id": 1054867,
"title": "One Battle After Another",
"original_title": "One Battle After Another",
"overview": "Washed-up revolutionary Bob exists in a state of stoned paranoia, surviving off-grid with his spirited, self-reliant daughter, Willa. When his evil nemesis resurfaces after 16 years and she goes missing, the former radical scrambles to find her, father and daughter both battling the consequences of his past.",
"poster_path": "/m1jFoahEbeQXtx4zArT2FKdbNIj.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
53,
80,
28
],
"popularity": 99.6123,
"release_date": "2025-09-23",
"video": false,
"vote_average": 7.495,
"vote_count": 1744
},
{
"adult": false,
"backdrop_path": "/oIJjO1CvEdTMFNkWfHaV0RB584G.jpg",
"id": 628847,
"title": "Trap House",
"original_title": "Trap House",
"overview": "An undercover DEA agent and his partner embark on a game of cat and mouse with an audacious, and surprising group of thieves - their own rebellious teenagers, who have begun robbing from a dangerous cartel, using their parents' tactics and top-secret intel to do it.",
"poster_path": "/ctU9S47MoJDN9CB7SCaitcfyyIu.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
28,
80,
53
],
"popularity": 27.4973,
"release_date": "2025-11-14",
"video": false,
"vote_average": 6.3,
"vote_count": 10
},
{
"adult": false,
"backdrop_path": "/hpXBJxLD2SEf8l2CspmSeiHrBKX.jpg",
"id": 1062722,
"title": "Frankenstein",
"original_title": "Frankenstein",
"overview": "Dr. Victor Frankenstein, a brilliant but egotistical scientist, brings a creature to life in a monstrous experiment that ultimately leads to the undoing of both the creator and his tragic creation.",
"poster_path": "/g4JtvGlQO7DByTI6frUobqvSL3R.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
18,
14,
27
],
"popularity": 141.0997,
"release_date": "2025-10-17",
"video": false,
"vote_average": 7.772,
"vote_count": 2047
},
{
"adult": false,
"backdrop_path": "/vRoIogTQDO5yAmTmH5uGrlPfS0N.jpg",
"id": 1124566,
"title": "Sentimental Value",
"original_title": "Affeksjonsverdi",
"overview": "Sisters Nora and Agnes reunite with their estranged father, the charismatic Gustav, a once-renowned director who offers stage actress Nora a role in what he hopes will be his comeback film. When Nora turns it down, she soon discovers he has given her part to an eager young Hollywood star.",
"poster_path": "/pz9NCWxxOk3o0W3v1Zkhawrwb4i.jpg",
"media_type": "movie",
"original_language": "no",
"genre_ids": [
18
],
"popularity": 18.4753,
"release_date": "2025-08-20",
"video": false,
"vote_average": 7.6,
"vote_count": 96
},
{
"adult": false,
"backdrop_path": "/9tOkjBEiiGcaClgJFtwocStZvIT.jpg",
"id": 269149,
"title": "Zootopia",
"original_title": "Zootopia",
"overview": "Determined to prove herself, Officer Judy Hopps, the first bunny on Zootopia's police force, jumps at the chance to crack her first case - even if it means partnering with scam-artist fox Nick Wilde to solve the mystery.",
"poster_path": "/hlK0e0wAQ3VLuJcsfIYPvb4JVud.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
16,
12,
10751,
35
],
"popularity": 133.2081,
"release_date": "2016-02-11",
"video": false,
"vote_average": 7.755,
"vote_count": 17184
},
{
"adult": false,
"backdrop_path": "/jUSfucwuJXp8QADKXAclOtrO8c.jpg",
"id": 1439112,
"title": "Muzzle: City of Wolves",
"original_title": "Muzzle: City of Wolves",
"overview": "LAPD officer Jake Rosser endeavors to lead a peaceful life with his family and retired K-9 officer, Socks. However, tranquility dissolves into chaos when a gang targets them in a brutal attack. Alongside his new K-9 partner Argos, Jake launches into a relentless pursuit of justice, determined to protect his loved ones.",
"poster_path": "/vXcDH3YqSgXKYQrPKvkvqC5phT2.jpg",
"media_type": "movie",
"original_language": "en",
"genre_ids": [
28,
80,
53,
27,
18,
9648
],
"popularity": 3.6297,
"release_date": "2025-11-13",
"video": false,
"vote_average": 4.833,
"vote_count": 6
},
{
"adult": false,
"backdrop_path": "/4BtL2vvEufDXDP4u6xQjjQ1Y2aT.jpg",
"id": 1419406,
"title": "The Shadow's Edge",
"original_title": "捕风追影",
"overview": "Macau Police brings the tracking expert police officer out of retirement to help catch a dangerous group of professional thieves.",
"poster_path": "/e0RU6KpdnrqFxDKlI3NOqN8nHL6.jpg",
"media_type": "movie",
"original_language": "zh",
"genre_ids": [
28,
80,
53
],
"popularity": 256.2961,
"release_date": "2025-08-16",
"video": false,
"vote_average": 6.4,
"vote_count": 132
}
],
"total_pages": 500,
"total_results": 10000
};
    const trendingMovies = trendingMoviesData.results;
    return(
        <section className="movie_list">
            <header className='align_center movie_list_header'>
                <h2 className='align_center movie_list_heading'>Popular Movies</h2>
                <div className='align_center movie_list_fs'>
                    <ul className="align_center movie_filter">
                        {/* <li className="movie_filter_item active">8+ Star</li>
                        <li className="movie_filter_item">7+ Star</li>
                        <li className="movie_filter_item">6+ Star</li> */}
                        <li className="movie_filter_item">Top 10</li>
                    </ul>

                    {/* <select name="" id="" className="movie_sorting">
                        <option value="">SortBy</option>
                        <option value="">Date</option>
                        <option value="">Rating</option>
                    </select>
                    <select name="" id="" className="movie_sorting">
                        <option value="">Ascending</option>
                        <option value="">Descending</option>
                    </select> */}
                </div>
            </header>
            <div className='movie_cards'>
                <MovieCard/>
                {trendingMovies.map(movie => (<div>{movie.title}<MovieCard></MovieCard></div>))}
            </div>
        </section>
    );
};
export default MovieList;