def main(context):
    url = context.req.body.get('url')
    return context.res.json({"status": "analyzed", "url": url})
