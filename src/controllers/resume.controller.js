export const uploadResume = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a resume"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Resume uploaded successfully",

            file: {
                originalName: req.file.originalname,
                fileName: req.file.filename,
                size: req.file.size,
                path: req.file.path
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Resume upload failed",
            error: error.message
        });
    }
};