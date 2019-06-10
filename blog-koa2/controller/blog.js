const xss = require('xss')
const { exec } = require('../db/mysql')

const getList = async (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`

    // 返回promise
    return await exec(sql)
}

const getDetail = async (id) => {
    let sql = `select * from blogs where id='${id}'`
    const rows = await exec(sql)
    return rows[0]
}

const newBlog = async (blogData = {}) => {
    // blogData 是一个博客对象， 包含title content author 属性
    // const {title, content, author} = blogData
    const title = xss(blogData.title)
    console.log('title is:', title)
    const content = xss(blogData.content)
    const author = blogData.author
    const createtime = Date.now()
    const sql = `
        insert into blogs (title, content, createtime, author) 
        values ('${title}', '${content}', ${createtime}, '${author}')
    `
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

const updateBlog = async (id, blogData = {}) => {
    // blogData 是一个博客对象， 包含title content 属性

    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const sql = `
        update blogs set title='${title}', content='${content}' where id='${id}'
    `
    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    } else {
        return false
    }
}

const delBlog = async (id, author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}'`
    const deleteData = await exec(sql)
    if (deleteData.affectedRows > 0) {
        return true
    }
    return false
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}