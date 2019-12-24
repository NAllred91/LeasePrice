export default () => new Promise((resolve, reject) => {
    fetch('/toc.json').then(result => {
        result.json().then(toc => {
            var dataPromises = toc.timestamps.map(timestamp => {
                return fetch('/' + timestamp + '.json').then(result => result.json())
            })

            Promise.all(dataPromises).then(data => {
                resolve(data)
            }).catch(err => reject(err))
        })
    })
})