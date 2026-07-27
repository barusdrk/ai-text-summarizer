const express = require("express");

const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();


// Mock AI Summary Generator

function createMockSummary(text, summaryLength) {
  const bulletCount = Number(summaryLength) || 5;

  const words = text
    .trim()
    .split(/\s+/);

  const preview = words
    .slice(0, 40)
    .join(" ");

  const bullets = [];

  for (let i = 1; i <= bulletCount; i++) {
    bullets.push(
      `${i}. Important point extracted from the text: ${preview.substring(
        0,
        80
      )}...`
    );
  }

  return `
${bullets.join("\n")}


Action Items

- Review the summarized information.
- Identify important tasks and priorities.
- Share relevant details with the team if needed.


Keywords

AI, Technology, Productivity, Document, Information, Analysis, Summary, Business, Planning, Communication
`;
}


// Summarize Text (Protected)

router.post("/summarize", auth, async (req, res) => {
  try {
    const {
      text,
      summaryLength,
    } = req.body;


    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text is required.",
      });
    }


    const summary = createMockSummary(
      text,
      summaryLength
    );


    await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          summaries: {
            originalText: text,
            summary,
            createdAt: new Date(),
          },
        },
      }
    );


    res.json({
      success: true,
      result: summary,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to summarize text.",
    });
  }
});


// Summary History

router.get("/history", auth, async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("summaries");


    res.json({
      success: true,
      summaries: user.summaries.reverse(),
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve summary history.",
    });
  }
});


// Delete Summary History

router.delete("/history", auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          summaries: [],
        },
      }
    );


    res.json({
      success: true,
      message: "Summary history cleared.",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to clear summary history.",
    });
  }
});


module.exports = router;
