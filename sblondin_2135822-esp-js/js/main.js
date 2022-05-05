const app = {
    data() {
        return {
            jour_vide: [],
            journees: [],
            info_show: [],
            unix: "",
            date: "",
            select: true,
            spectacle: [],
        }
    },

    mounted() {
        this.getDay()

        console.log('salut')
    },

    methods: {      

        // fetch qui va chercher le calendrier en get

        getDay() {  

            const options = {
                method: "GET",
                cors: true,
            }

            const url = "http://jduranleau.cpsw-fcsei.com/js-synthese/api/calendar.php?month=" + 4 + "&year=" + 2022
            
            fetch(url, options).then(resp => resp.json()).then(data => {
                
                this.journees = data.days
                this.jour_vide = data.blank_starting_days
            })
        },

        // Function qui affiche les bonne infos pour chaque jour cliqué.

        getInfo(information) { 
            this.unix = information.date_unix_time
            this.date = information.date
            this.spectacle = information.shows.length
            this.select = information

            this.getShow()   
        },


        // Function qui affiche les show disponible pour chaque jour en get.

        getShow() {  

            const options = {
                method: "GET",
                cors: true,
            }

            const url = "http://jduranleau.cpsw-fcsei.com/js-synthese/api/shows.php?date_unix_time=" + this.unix
            
            fetch(url, options).then(resp => resp.json()).then(data => {
                this.info_show = data
            })
        },

        // Fonction pour la reservation des sieges en post.

        getSeat(show) {  

            const url = "http://jduranleau.cpsw-fcsei.com/js-synthese/api/book-tickets.php"
            const params_get = ""
            const params_post = new FormData()
    
            params_post.set("show_id", show.id)
            params_post.set("number_of_seats", 1)
            
            const options = {
                method: "POST",
                body: params_post,
                cors: true,
            }

            fetch(url + params_get, options).then(resp => resp.json()).then(data => {
            
            // Tant qu'il reste des sièges , réduit de -1 a chaque click de l'utilsateur.  
                if (show.total_seats_left == 0) {
                    show.total_seats_left -= 1
                }
            })
        },
    },
}

Vue.createApp(app).mount('#app')